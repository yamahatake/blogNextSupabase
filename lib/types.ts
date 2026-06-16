export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  author_id: string;
  author_email: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  user_email: string;
  content: string;
  created_at: string;
};
