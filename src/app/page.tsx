'use client';

import Link from 'next/link';
import { useCollection, useAuth } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';

export default function Home() {
  const db = useFirestore();
  const auth = useAuth();

  // 確実にパーミッションを通すためにバックグラウンドで匿名ログイン
  useEffect(() => {
    if (auth) {
      signInAnonymously(auth).catch(() => {});
    }
  }, [auth]);
  
  const articlesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc'),
      limit(30)
    );
  }, [db]);

  const { data: articles, isLoading } = useCollection(articlesQuery);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '10px', backgroundColor: '#ffffff', color: '#000000' }}>
      <header style={{ borderBottom: '2px double #000', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '1.8rem', textAlign: 'center', margin: '10px 0' }}>北海学園大学新聞会</h1>
        <p style={{ textAlign: 'right', fontSize: '0.8rem' }}>
          最終更新日: {new Date().toLocaleDateString('ja-JP')}
        </p>
      </header>

      <table border={1} cellPadding={5} style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
        <tbody>
          <tr>
            <td valign="top" style={{ width: '150px', backgroundColor: '#eeeeee' }}>
              <strong style={{ display: 'block', borderBottom: '1px solid #000', marginBottom: '5px' }}>メニュー</strong>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                ・<Link href="/">トップ</Link><br />
                ・<Link href="/category/Campus">学内ニュース</Link><br />
                ・<Link href="/category/Event">イベント</Link><br />
                ・<Link href="/category/Interview">インタビュー</Link><br />
                ・<Link href="/admin">管理者</Link>
              </div>
              <p style={{ fontSize: '0.7rem', marginTop: '20px' }}>
                since 1950
              </p>
            </td>
            <td valign="top">
              <h2 style={{ fontSize: '1.1rem', backgroundColor: '#000080', color: '#ffffff', padding: '3px 8px', margin: '0 0 10px 0' }}>
                最新のニュース (note.com同期)
              </h2>
              
              {isLoading ? (
                <p>読み込み中...</p>
              ) : (
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {articles && articles.length > 0 ? (
                    articles.map((article) => (
                      <li key={article.id} style={{ marginBottom: '8px', borderBottom: '1px dotted #ccc', paddingBottom: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#666', marginRight: '8px' }}>
                          [{article.publishDate.split('T')[0]}]
                        </span>
                        <Link href={`/articles/${article.id}`} style={{ fontWeight: 'bold' }}>
                          {article.title}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>記事がありません。</li>
                  )}
                </ul>
              )}

              <h2 style={{ fontSize: '1.1rem', backgroundColor: '#000080', color: '#ffffff', padding: '3px 8px', margin: '20px 0 10px 0' }}>
                新聞会について
              </h2>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                北海学園大学公認の学生新聞組織です。学内の出来事や学生の声を独自の視点で発信しています。<br />
                現在はnote.comと連携し、最新情報をリアルタイムにお届けしています。
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <footer style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', borderTop: '1px solid #000', paddingTop: '10px' }}>
        Copyright (C) 2024 HGU Newspaper Club. All Rights Reserved.
      </footer>
    </div>
  );
}