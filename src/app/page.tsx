'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export default function Home() {
  const [updateDate, setUpdateDate] = useState<string>('');
  const db = useFirestore();
  
  // ハイドレーションエラー防止のため、日付はクライアントサイドで設定
  useEffect(() => {
    setUpdateDate(new Date().toLocaleDateString('ja-JP'));
  }, []);

  const articlesRef = useMemoFirebase(() => {
    if (!db) return null;
    // 公開済みの記事のみを取得
    return query(collection(db, 'articles'), where('isPublished', '==', true));
  }, [db]);

  const { data: rawArticles, isLoading } = useCollection(articlesRef);

  // 日付順に並び替え
  const articles = rawArticles 
    ? [...rawArticles]
        .sort((a, b) => {
          const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
          const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 50)
    : [];

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
              <ul style={{ paddingLeft: '20px' }}>
                <li><Link href="/">トップページ</Link></li>
                <li><Link href="/login">管理者入口</Link></li>
              </ul>
              <hr />
              <font size="1">
                Since: 1950<br />
                Update: {updateDate || '----/--/--'}
              </font>
            </td>
            <td width="80%" valign="top">
              <table width="100%" border={0} cellPadding={5}>
                <tbody>
                  <tr>
                    <td style={{ backgroundColor: '#000080', color: '#ffffff' }}>
                      <b>最新の記事</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {isLoading ? (
                        <p>読み込み中...</p>
                      ) : (
                        <ul style={{ listStyleType: 'square', paddingLeft: '25px' }}>
                          {articles.length > 0 ? (
                            articles.map((article) => (
                              <li key={article.id}>
                                <font size="2">[{article.publishDate ? article.publishDate.split('T')[0] : '不明'}]</font> 
                                <Link href={`/articles/${article.id}`}><b>{article.title}</b></Link>
                                <font size="1"> ({article.categoryId || '未分類'})</font>
                              </li>
                            ))
                          ) : (
                            <li>現在、公開されている記事はありません。</li>
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
                      <p>当サイトは表示速度を最優先し、極限まで軽量化を行っております。</p>
                      <p>すべての情報は手動で更新されています。</p>
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
                Copyright (C) 2024-2025 北海学園大学新聞会 All Rights Reserved.
              </font>
            </td>
          </tr>
        </tbody>
      </table>
    </center>
  );
}
