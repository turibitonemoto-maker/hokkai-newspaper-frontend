
import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * 外部から記事データを取得するためのJSON APIエンドポイント。
 * GET /api/articles
 */
export async function GET() {
  try {
    // サーバーサイドでの初期化
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);

    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef,
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const articles = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
