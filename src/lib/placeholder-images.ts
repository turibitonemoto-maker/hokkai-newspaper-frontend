import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// data が正しく読み込まれているか、空でないかを確認した上でエクスポート
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages || [];