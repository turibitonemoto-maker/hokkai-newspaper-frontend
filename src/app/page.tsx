'use client';

import Link from 'next/link';
import { useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';

export default function Home() {
  const db = useFirestore();
  
  const articlesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc'),
      limit(20)
    );
  }, [db]);

  const { data: articles, isLoading } = useCollection(articlesQuery);

  return (
    <div className="container">
      <header>
        <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>北海学園大学新聞会 公式サイト</h1>
        <p style={{ textAlign: 'center', borderBottom: '2px double #000' }}>
          更新日: {new Date().toLocaleDateString('ja-JP')}
        </p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
        {/* サイドバー風メニュー */}
        <nav style={{ width: '150px', shrink: 0 }}>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr><td><Link href="/">トップ</Link></td></tr>
              <tr><td><Link href="/category/Campus">学内ニュース</Link></td></tr>
              <tr><td><Link href="/category/Event">イベント</Link></td></tr>
              <tr><td><Link href="/category/Interview">インタビュー</Link></td></tr>
              <tr><td><Link href="/admin">管理者用</Link></td></tr>
            </tbody>
          </table>
        </nav>

        {/* メインコンテンツ */}
        <main style={{ flexGrow: 1 }}>
          <h2>最新のニュース (note.com同期中)</h2>
          {isLoading ? (
            <p>読み込み中...</p>
          ) : (
            <table style={{ border: 'none' }}>
              <tbody>
                {articles && articles.length > 0 ? (
                  articles.map((article) => (
                    <tr key={article.id}>
                      <td style={{ border: 'none', padding: '5px 0' }}>
                        [{article.publishDate.split('T')[0]}] 
                        <Link href={`/articles/${article.id}`} style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                          {article.title}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td style={{ border: 'none' }}>記事がありません。</td></tr>
                )}
              </tbody>
            </table>
          )}

          <h2 style={{ marginTop: '20px' }}>新聞会について</h2>
          <p>
            1950年代より続く、北海学園大学公認の学生新聞組織です。<br />
            学生の視点から学内の真実を伝えます。
          </p>
        </main>
      </div>

      <footer style={{ marginTop: '30px', borderTop: '1px solid #000', paddingTop: '10px', textAlign: 'center', fontSize: '0.8rem' }}>
        Copyright (C) 2024 HGU Newspaper Club. All Rights Reserved.
      </footer>
    </div>
  );
}