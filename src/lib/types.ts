export type Category = 'Campus' | 'Event' | 'Interview' | 'Sports' | 'Column' | 'Opinion' | 'Paper';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  summary?: string;
  category: Category;
  author: string;
  publishDate: string;
  imageUrl: string;
  imageHint: string;
  featured?: boolean;
}
