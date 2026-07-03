import { Request, Response } from 'express';
import prisma from '../prisma';
import { PostStatus } from '@prisma/client';
import { slugify } from '../utils/slugify';

export const indexPosts = async (req: Request, res: Response): Promise<Response> => {
  const { page, per_page, status } = req.query;

  // 1. Validate status if provided
  if (status !== undefined) {
    const validStatuses = Object.values(PostStatus);
    if (!validStatuses.includes(status as PostStatus)) {
      return res.status(422).json({
        error: 'Unprocessable Entity',
        message: `Invalid status: '${status}'. Valid values are: ${validStatuses.join(', ')}`
      });
    }
  }

  // 2. Parse pagination parameters
  const parsedPage = page ? parseInt(page as string, 10) : 1;
  const parsedPerPage = per_page ? parseInt(per_page as string, 10) : 10;

  if (isNaN(parsedPage) || parsedPage <= 0 || isNaN(parsedPerPage) || parsedPerPage <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Pagination parameters (page, per_page) must be positive integers.'
    });
  }

  // 3. Build query conditions
  const where: any = {};
  if (status) {
    where.status = status as PostStatus;
  }

  try {
    // 4. Query DB for total count and records
    const total = await prisma.post.count({ where });
    const posts = await prisma.post.findMany({
      where,
      skip: (parsedPage - 1) * parsedPerPage,
      take: parsedPerPage,
      orderBy: { created_at: 'desc' },
    });

    const totalPages = Math.ceil(total / parsedPerPage);

    return res.status(200).json({
      data: posts,
      meta: {
        total,
        page: parsedPage,
        per_page: parsedPerPage,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while fetching posts.',
    });
  }
};

export const showPost = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  // Validate if id is a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid ID format. Must be a valid UUID.'
    });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Post with ID '${id}' not found.`
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post detail:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while fetching the post.'
    });
  }
};

export const storePost = async (req: Request, res: Response): Promise<Response> => {
  const { title, content, excerpt, slug, status, author_id } = req.body;

  // 1. Validate title presence and non-emptiness
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(422).json({
      error: 'Unprocessable Entity',
      message: 'Title is required and cannot be empty.'
    });
  }

  // 2. Validate content presence and non-emptiness
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(422).json({
      error: 'Unprocessable Entity',
      message: 'Content is required and cannot be empty.'
    });
  }

  // 3. Validate status if provided, default to 'draft'
  let postStatus: PostStatus = PostStatus.draft;
  if (status !== undefined) {
    const validStatuses = Object.values(PostStatus);
    if (!validStatuses.includes(status as PostStatus)) {
      return res.status(422).json({
        error: 'Unprocessable Entity',
        message: `Invalid status: '${status}'. Valid values are: ${validStatuses.join(', ')}`
      });
    }
    postStatus = status as PostStatus;
  }

  try {
    // 4. Generate unique slug
    let baseSlug = slug && typeof slug === 'string' && slug.trim() !== '' 
      ? slugify(slug) 
      : slugify(title);

    if (!baseSlug) {
      baseSlug = 'post-' + Math.random().toString(36).substring(2, 7);
    }

    let finalSlug = baseSlug;
    let slugExists = await prisma.post.findUnique({ where: { slug: finalSlug } });
    let counter = 1;
    while (slugExists) {
      finalSlug = `${baseSlug}-${counter}`;
      slugExists = await prisma.post.findUnique({ where: { slug: finalSlug } });
      counter++;
    }

    // 5. Determine published_at timestamp
    const publishedAt = postStatus === PostStatus.publish ? new Date() : null;

    // 6. Create post record
    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: excerpt || null,
        slug: finalSlug,
        status: postStatus,
        author_id: author_id || 'anonymous',
        published_at: publishedAt,
      },
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while creating the post.'
    });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { title, content, excerpt, slug, status } = req.body;

  // 1. Validate if id is a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid ID format. Must be a valid UUID.'
    });
  }

  try {
    // 2. Fetch existing post
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Post with ID '${id}' not found.`
      });
    }

    // 3. Status transitions & validations
    let newStatus: PostStatus | undefined;
    if (status !== undefined) {
      const validStatuses = Object.values(PostStatus);
      if (!validStatuses.includes(status as PostStatus)) {
        return res.status(422).json({
          error: 'Unprocessable Entity',
          message: `Invalid status: '${status}'. Valid values are: ${validStatuses.join(', ')}`
        });
      }
      newStatus = status as PostStatus;
    }

    // 4. Trash restrictions
    if (existingPost.status === PostStatus.trash) {
      if (!newStatus || newStatus === PostStatus.trash) {
        return res.status(422).json({
          error: 'Unprocessable Entity',
          message: 'Cannot update a trashed post directly. You must restore it first.'
        });
      }
    }

    // 5. Title & content validation if provided
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(422).json({
        error: 'Unprocessable Entity',
        message: 'Title cannot be empty.'
      });
    }
    if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
      return res.status(422).json({
        error: 'Unprocessable Entity',
        message: 'Content cannot be empty.'
      });
    }

    // 6. Build the update payload
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt || null;

    if (newStatus !== undefined) {
      updateData.status = newStatus;

      // Handle transitions
      if (existingPost.status === PostStatus.trash && newStatus !== PostStatus.trash) {
        updateData.deleted_at = null;
      }

      if (newStatus === PostStatus.trash && existingPost.status !== PostStatus.trash) {
        updateData.deleted_at = new Date();
      }

      if (newStatus === PostStatus.publish && existingPost.published_at === null) {
        const finalTitle = title !== undefined ? title : existingPost.title;
        const finalContent = content !== undefined ? content : existingPost.content;
        if (!finalTitle || finalTitle.trim() === '' || !finalContent || finalContent.trim() === '') {
          return res.status(422).json({
            error: 'Unprocessable Entity',
            message: 'Cannot publish a post with empty title or content.'
          });
        }
        updateData.published_at = new Date();
      }
    }

    // 7. Handle slug update and uniqueness
    if (slug !== undefined) {
      if (typeof slug !== 'string' || slug.trim() === '') {
        return res.status(422).json({
          error: 'Unprocessable Entity',
          message: 'Slug cannot be empty.'
        });
      }
      const baseSlug = slugify(slug);
      let finalSlug = baseSlug;

      let slugExists = await prisma.post.findFirst({
        where: {
          slug: finalSlug,
          id: { not: id },
        },
      });

      let counter = 1;
      while (slugExists) {
        finalSlug = `${baseSlug}-${counter}`;
        slugExists = await prisma.post.findFirst({
          where: {
            slug: finalSlug,
            id: { not: id },
          },
        });
        counter++;
      }
      updateData.slug = finalSlug;
    }

    // 8. Update post in DB
    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while updating the post.'
    });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  // 1. Validate if id is a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid ID format. Must be a valid UUID.'
    });
  }

  try {
    // 2. Fetch existing post
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Post with ID '${id}' not found.`
      });
    }

    // 3. Perform soft delete
    await prisma.post.update({
      where: { id },
      data: {
        status: PostStatus.trash,
        deleted_at: new Date(),
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error soft-deleting post:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while deleting the post.'
    });
  }
};

