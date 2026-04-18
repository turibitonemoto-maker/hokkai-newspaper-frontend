/**
 * 物理的データ構造定義 (backend.json 同期版)
 */
export type CategoryId = 'Campus' | 'Event' | 'Interview' | 'Sports' | 'Column' | 'Opinion' | 'Paper' | 'Viewer';

export interface Article {
  id: string;
  title: string;
  issueNumber?: string;
  noteUrl?: string;
  pdfUrl?: string;
  paperImages?: string[];
  source?: string;
  publishDate: string;
  lastSyncedDate?: string;
  content?: string;
  summary?: string;
  mainImageUrl?: string;
  mainImageCaption?: string;
  caption?: string; // 命名規則の揺れを吸収するためのフォールバック
  isPublished: boolean;
  categoryId: CategoryId;
  authorName?: string;
}

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  displayEndTime?: any;
}