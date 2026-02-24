'use client';

import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';

export default function Home() {
  const db = useFirestore();
  
  // 公開済みの記事を最新順に取得
  const articlesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc'),
      limit(100)
    );
  }, [db]);

  const { data: articles, isLoading } = useCollection(articlesQuery);

  return (
    <center>
      <table width="95%" border={0} cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr>
            <td colSpan={2} align="center" style={{ backgroundColor: '#ffffff', padding: '20px 0', borderBottom: '3px double #000000' }}>
              <font size="6"><b>北海学園大学新聞会 公式サイト</b></font><br />
              <font size="2">HOKKAI GAKUEN UNIVERSITY NEWSPAPER CLUB</font>
            </td>
          </tr>
          <tr>
            <td width="20%" valign="top" style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
              <b>■ メニュー ■</b><br /><br />
              <font size="3">
              ・<Link href="/">トップページ</Link><br />
              ・<Link href="/category/Campus">学内ニュース</Link><br />
              ・<Link href="/category/Event">行事案内</Link><br />
              ・<Link href="/category/Interview">学員取材</Link><br />
              ・<Link href="/admin">管理者室</Link><br />
              </font>
              <hr />
              <font size="2">
               since: 1950<br />
               更新日: {new Date().toLocaleDateString('ja-JP')}
              </font>
            </td>
            <td width="80%" valign="top" style={{ padding: '20px' }}>
              <table width="100%" border={0} cellPadding={5}>
                <tbody>
                  <tr>
                    <td style={{ backgroundColor: '#000080', color: '#ffffff' }}>
                      <b>最新の記事 (note.com 同期)</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {isLoading ? (
                        <p>現在データを読み込んでいます...</p>
                      ) : (
                        <ul style={{ lineHeight: '1.8' }}>
                          {articles && articles.length > 0 ? (
                            articles.map((article) => (
                              <li key={article.id}>
                                <font size="2">[{article.publishDate.split('T')[0]}]</font> 
                                <Link href={`/articles/${article.id}`}><b>{article.title}</b></Link>
                              </li>
                            ))
                          ) : (
                            <li>記事が見つかりませんでした。</li>
                          )}
                        </ul>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ backgroundColor: '#000080', color: '#ffffff' }}>
                      <b>新聞会よりお知らせ</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>当新聞会は、北海学園大学の歴史と共に歩んできた学生団体です。</p>
                      <p>現在、note.comを通じてデジタル発信を強化しております。右記のメニューより各カテゴリの記事をご覧いただけます。</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan={2} align="center" style={{ borderTop: '1px solid #000000', padding: '10px' }}>
              <font size="2">
                Copyright (C) 2024 北海学園大学新聞会 All Rights Reserved.<br />
                このサイトの画像および文章の無断転載を禁じます。
              </font>
            </td>
          </tr>
        </tbody>
      </table>
    </center>
  );
}