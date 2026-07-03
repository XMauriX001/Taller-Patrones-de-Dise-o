export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  status: 'draft' | 'pending' | 'publish' | 'private' | 'trash';
  author_id: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  deleted_at: Date | null;
}
