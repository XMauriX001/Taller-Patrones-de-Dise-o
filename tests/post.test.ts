import request from 'supertest';
import app from '../src/app';
import prisma from '../src/prisma';

describe('GET /posts', () => {
  beforeEach(async () => {
    // Clean up posts table before each test
    await prisma.post.deleteMany();
  });

  afterAll(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  });

  it('should return 200 OK with empty array and pagination meta if no posts exist', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta).toEqual({
      total: 0,
      page: 1,
      per_page: 10,
      total_pages: 0,
    });
  });

  it('should return paginated posts', async () => {
    // Insert test posts
    await prisma.post.createMany({
      data: [
        { title: 'Post 1', content: 'Content 1', slug: 'post-1', status: 'publish', author_id: 'user1' },
        { title: 'Post 2', content: 'Content 2', slug: 'post-2', status: 'draft', author_id: 'user1' },
        { title: 'Post 3', content: 'Content 3', slug: 'post-3', status: 'publish', author_id: 'user2' },
      ],
    });

    const res = await request(app).get('/posts?page=1&per_page=2');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.meta).toEqual({
      total: 3,
      page: 1,
      per_page: 2,
      total_pages: 2,
    });
  });

  it('should filter posts by status', async () => {
    await prisma.post.createMany({
      data: [
        { title: 'Post 1', content: 'Content 1', slug: 'post-1', status: 'publish', author_id: 'user1' },
        { title: 'Post 2', content: 'Content 2', slug: 'post-2', status: 'draft', author_id: 'user1' },
      ],
    });

    const res = await request(app).get('/posts?status=draft');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].status).toBe('draft');
  });

  it('should return 422 Unprocessable Entity if status is invalid', async () => {
    const res = await request(app).get('/posts?status=invalid_status');
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('Unprocessable Entity');
  });
});

describe('GET /posts/:id', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 200 OK with the post details if it exists', async () => {
    const createdPost = await prisma.post.create({
      data: {
        title: 'Detail Post',
        content: 'This is the detailed post body.',
        slug: 'detail-post',
        status: 'publish',
        author_id: 'user3',
      },
    });

    const res = await request(app).get(`/posts/${createdPost.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdPost.id);
    expect(res.body.title).toBe('Detail Post');
    expect(res.body.content).toBe('This is the detailed post body.');
  });

  it('should return 404 Not Found if post with valid UUID does not exist', async () => {
    const nonExistentUuid = 'a0000000-b000-c000-d000-e00000000000';
    const res = await request(app).get(`/posts/${nonExistentUuid}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });

  it('should return 400 Bad Request if ID is in invalid format', async () => {
    const res = await request(app).get('/posts/not-a-valid-uuid');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });
});

describe('POST /posts', () => {
  beforeEach(async () => {
    await prisma.post.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 201 Created and the created post details when valid request is made', async () => {
    const postData = {
      title: 'My Store Post',
      content: 'This is some content.',
      slug: 'my-store-post',
      status: 'publish',
      author_id: 'user4',
    };

    const res = await request(app).post('/posts').send(postData);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(postData.title);
    expect(res.body.slug).toBe(postData.slug);
    expect(res.body.status).toBe('publish');
    expect(res.body.published_at).not.toBeNull();
  });

  it('should return 422 Unprocessable Entity if title is missing', async () => {
    const res = await request(app).post('/posts').send({
      content: 'Only content',
    });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('Unprocessable Entity');
  });

  it('should return 422 Unprocessable Entity if content is missing', async () => {
    const res = await request(app).post('/posts').send({
      title: 'Only title',
    });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('Unprocessable Entity');
  });

  it('should default to status draft if not provided', async () => {
    const res = await request(app).post('/posts').send({
      title: 'No status post',
      content: 'Hello status testing',
    });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('draft');
    expect(res.body.published_at).toBeNull();
  });

  it('should auto-generate slug if not provided', async () => {
    const res = await request(app).post('/posts').send({
      title: 'My Custom Slug Gen Test!',
      content: 'Testing slugify logic',
    });
    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('my-custom-slug-gen-test');
  });

  it('should return 422 Unprocessable Entity if status is invalid', async () => {
    const res = await request(app).post('/posts').send({
      title: 'Invalid status post',
      content: 'Some body content',
      status: 'non_existent_status',
    });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('Unprocessable Entity');
  });

  it('should resolve slug collision by appending a unique counter suffix', async () => {
    // Create first post
    await request(app).post('/posts').send({
      title: 'Collision Post',
      content: 'Content 1',
    });

    // Create second post with same title (triggers auto slug collision)
    const res = await request(app).post('/posts').send({
      title: 'Collision Post',
      content: 'Content 2',
    });

    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('collision-post-1');
  });
});

describe('PUT/PATCH /posts/:id', () => {
  let createdPostId: string;

  beforeEach(async () => {
    await prisma.post.deleteMany();
    const post = await prisma.post.create({
      data: {
        title: 'Initial Title',
        content: 'Initial Content',
        slug: 'initial-title',
        status: 'draft',
        author_id: 'user5',
      },
    });
    createdPostId = post.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 200 OK and update the post fields', async () => {
    const res = await request(app)
      .put(`/posts/${createdPostId}`)
      .send({ title: 'New Updated Title', content: 'New Updated Content' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New Updated Title');
    expect(res.body.content).toBe('New Updated Content');
  });

  it('should return 404 Not Found if post ID does not exist', async () => {
    const nonExistentUuid = 'a0000000-b000-c000-d000-e00000000000';
    const res = await request(app)
      .put(`/posts/${nonExistentUuid}`)
      .send({ title: 'Title' });
    expect(res.status).toBe(404);
  });

  it('should return 422 Unprocessable Entity if updating with an invalid status', async () => {
    const res = await request(app)
      .put(`/posts/${createdPostId}`)
      .send({ status: 'invalid_status' });
    expect(res.status).toBe(422);
  });

  it('should return 422 Unprocessable Entity if title is empty string', async () => {
    const res = await request(app)
      .put(`/posts/${createdPostId}`)
      .send({ title: '  ' });
    expect(res.status).toBe(422);
  });

  it('should block updates if the post is in trash status and we try to modify other attributes', async () => {
    // Put post in trash first
    await prisma.post.update({
      where: { id: createdPostId },
      data: { status: 'trash', deleted_at: new Date() },
    });

    const res = await request(app)
      .put(`/posts/${createdPostId}`)
      .send({ title: 'Attempt to change title while in trash' });
    expect(res.status).toBe(422);
    expect(res.body.message).toContain('Cannot update a trashed post directly');
  });

  it('should restore a trashed post when updating status to draft, and clear deleted_at', async () => {
    // Put post in trash first
    await prisma.post.update({
      where: { id: createdPostId },
      data: { status: 'trash', deleted_at: new Date() },
    });

    const res = await request(app)
      .put(`/posts/${createdPostId}`)
      .send({ status: 'draft', title: 'Restored Title' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('draft');
    expect(res.body.title).toBe('Restored Title');
    expect(res.body.deleted_at).toBeNull();
  });

  it('should set published_at when post status changes to publish for the first time', async () => {
    const res = await request(app)
      .put(`/posts/${createdPostId}`)
      .send({ status: 'publish' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('publish');
    expect(res.body.published_at).not.toBeNull();
  });

  it('should resolve slug collision when slug is updated to an existing slug', async () => {
    // Create another post
    await prisma.post.create({
      data: {
        title: 'Other Post',
        content: 'Other Content',
        slug: 'other-post',
        status: 'draft',
        author_id: 'user5',
      },
    });

    // Try to update createdPost slug to 'other-post'
    const res = await request(app)
      .put(`/posts/${createdPostId}`)
      .send({ slug: 'other-post' });
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('other-post-1');
  });
});

describe('DELETE /posts/:id', () => {
  let createdPostId: string;

  beforeEach(async () => {
    await prisma.post.deleteMany();
    const post = await prisma.post.create({
      data: {
        title: 'Delete Title',
        content: 'Delete Content',
        slug: 'delete-title',
        status: 'draft',
        author_id: 'user6',
      },
    });
    createdPostId = post.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 204 No Content and soft-delete the post', async () => {
    const res = await request(app).delete(`/posts/${createdPostId}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});

    // Check DB status
    const postInDb = await prisma.post.findUnique({
      where: { id: createdPostId },
    });
    expect(postInDb).not.toBeNull();
    expect(postInDb!.status).toBe('trash');
    expect(postInDb!.deleted_at).not.toBeNull();
  });

  it('should return 404 Not Found if post ID does not exist', async () => {
    const nonExistentUuid = 'a0000000-b000-c000-d000-e00000000000';
    const res = await request(app).delete(`/posts/${nonExistentUuid}`);
    expect(res.status).toBe(404);
  });

  it('should return 400 Bad Request if ID is in invalid format', async () => {
    const res = await request(app).delete('/posts/not-a-valid-uuid');
    expect(res.status).toBe(400);
  });
});




