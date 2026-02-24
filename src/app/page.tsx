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
      limit(50)
    );
  }, [db]);

  const { data: articles, isLoading } = useCollection(articlesQuery);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px', backgroundColor: '#ffffff', color: '#000000' }}>
      <header style={{ borderBottom: '3px double #000', marginBottom: '15px' }}>
        <h1 style={{ fontSize: '2.2rem', textAlign: 'center', margin: '15px 0', letterSpacing: '0.2em' }}>
          北海学園大学新聞会 公式サイト
        </h1>
        <p style={{ textAlign: 'right', fontSize: '0.85rem' }}>
          Last Updated: {new Date().toLocaleDateString('ja-JP')}
        </p>
      </header>

      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000' }}>
        <tbody>
          <tr>
            <td valign="top" style={{ width: '180px', backgroundColor: '#e0e0e0' }}>
              <strong style={{ display: 'block', borderBottom: '1px solid #000', marginBottom: '10px', fontSize: '1.1rem' }}>
                INDEX
              </strong>
              <div style={{ fontSize: '0.95rem', lineHeight: '2.0' }}>
                ・<Link href="/">トップページ</Link><br />
                ・<Link href="/category/Campus">学内ニュース</Link><br />
                ・<Link href="/category/Event">行事案内</Link><br />
                ・<Link href="/category/Interview">学員取材</Link><br />
                ・<Link href="/admin">管理者室</Link>
              </div>
              <div style={{ marginTop: '30px', borderTop: '1px solid #000', paddingTop: '10px', fontSize: '0.75rem' }}>
                <p>Since: 1950</p>
                <p>HGU Newspaper Club</p>
              </div>
            </td>
            <td valign="top">
              <h2 style={{ fontSize: '1.2rem', backgroundColor: '#000080', color: '#ffffff', padding: '5px 10px', margin: '0 0 15px 0' }}>
                最新情報 (note.com同期記事)
              </h2>
              
              {isLoading ? (
                <p>通信中...</p>
              ) : (
                <ul style={{ listStyleType: 'square', paddingLeft: '20px', margin: 0 }}>
                  {articles && articles.length > 0 ? (
                    articles.map((article) => (
                      <li key={article.id} style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#333', marginRight: '10px' }}>
                          [{article.publishDate.split('T')[0]}]
                        </span>
                        <Link href={`/articles/${article.id}`} style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                          {article.title}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>記事のデータが存在しません。</li>
                  )}
                </ul>
              )}

              <h2 style={{ fontSize: '1.2rem', backgroundColor: '#000080', color: '#ffffff', padding: '5px 10px', margin: '25px 0 15px 0' }}>
                新聞会紹介
              </h2>
              <p style={{ fontSize: '1.0rem', lineHeight: '1.6' }}>
                当新聞会は北海学園大学の公認団体です。学内の出来事、学生の活躍、教職員の声を独自に取材し、紙面およびインターネットを通じて発信しています。現在はnote.comを活用したデジタル発信に注力しております。
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.85rem', borderTop: '1px solid #000', paddingTop: '15px' }}>
        Copyright (C) 2024 北海学園大学新聞会 All Rights Reserved.<br />
        当サイトの内容の無断転載を禁じます。
      </footer>
    </div>
  );
}
