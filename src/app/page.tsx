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
      limit(50)
    );
  }, [db]);

  const { data: articles, isLoading } = useCollection(articlesQuery);

  return (
    <center>
      <table width="95%" border={0} cellPadding={10}>
        <tbody>
          <tr>
            <td align="center" style={{ borderBottom: '3px double #000000' }}>
              <h1>北海学園大学新聞会</h1>
              <font size="2">HOKKAI GAKUEN UNIVERSITY NEWSPAPER CLUB</font>
            </td>
          </tr>
        </tbody>
      </table>

      <table width="95%" border={0} cellPadding={10}>
        <tbody>
          <tr>
            <td width="20%" valign="top" style={{ borderRight: '1px solid #000000' }}>
              <p><b>■ メニュー</b></p>
              <ul>
                <li><Link href="/">トップページ</Link></li>
                <li><Link href="/admin">管理者室ログイン</Link></li>
              </ul>
              <hr />
              <font size="1">
                Since: 1950<br />
                Last Update: {new Date().toLocaleDateString('ja-JP')}
              </font>
            </td>
            <td width="80%" valign="top">
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
                        <p>Loading...</p>
                      ) : (
                        <ul style={{ listStyleType: 'square' }}>
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
                      <p>北海学園大学新聞会 公式ホームページへようこそ。</p>
                      <p>当会は1950年の創立以来、学内の情報を発信し続けております。</p>
                      <p>現在、note.comと連携した情報発信のデジタル化を推進しております。最新の活動報告は上記の記事リストよりご覧いただけます。</p>
                      <p>当サイトは表示速度を最優先し、極限まで軽量化を行っております。</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <hr width="95%" />
      
      <table width="95%" border={0} cellPadding={5}>
        <tbody>
          <tr>
            <td align="center">
              <font size="2">
                Copyright (C) 2024 北海学園大学新聞会 All Rights Reserved.<br />
                無断転載・複製を禁じます。
              </font>
            </td>
          </tr>
        </tbody>
      </table>
    </center>
  );
}