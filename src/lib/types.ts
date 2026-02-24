export type Category = 'Campus' | 'Event' | 'Interview' | 'Sports' | 'Opinion';

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