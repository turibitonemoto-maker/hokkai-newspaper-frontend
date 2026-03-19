import { MetadataRoute } from 'next'
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * サイトマップ自動生成 (物理スキャン版)
 * クローラーがサイト内の全記事・全ページを正確に把握できるようにします。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 本番公開の独自ドメイン
  const baseUrl = 'https://hokkai-gakuen-news.web.app';

  // 1. 静的ルートの定義
  const staticRoutes = ['', '/about', '/greeting', '/recruit', '/ads', '/contact', '/viewer'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  // 2. Firestore から全公開記事を取得して動的ルートを生成
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);
    const q = query(collection(db, 'articles'), where('isPublished', '==', true));
    const querySnapshot = await getDocs(q);
    
    articleRoutes = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${baseUrl}/articles/${doc.id}`,
        lastModified: data.publishDate ? new Date(data.publishDate) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    });
  } catch (e) {
    console.error('Sitemap synchronization error:', e);
  }

  return [...staticRoutes, ...articleRoutes];
}
