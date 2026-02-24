'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';

export default function ArticlePage() {
  const { id } = useParams();
  const db = useFirestore();
  const docRef = id && db ? doc(db, 'articles', id as string) : null;
  const { data: article, isLoading } = useDoc(docRef);

  if (isLoading) return <center><br />読み込み中...</center>;
  if (!article) return <center><br />記事が見つかりませんでした。<br /><Link href="/">トップへ戻る</Link></center>;

  return (
    <center>
      <table width="800" border={0} cellPadding={10} style={{ textAlign: 'left' }}>
        <tbody>
          <tr>
            <td>
              <Link href="/">トップ</Link> ＞ 記事詳細
              <hr />
              <h1>{article.title}</h1>
              <p><font size="2">公開日: {article.publishDate.split('T')[0]} | カテゴリ: {article.categoryId}</font></p>
              <hr />
              
              <div style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
                <p>{article.excerpt}</p>
                <br />
                <center>
                  <table border={1} cellPadding={20} style={{ backgroundColor: '#ffffcc' }}>
                    <tbody>
                      <tr>
                        <td align="center">
                          <b>この記事の全文は note.com で公開中です</b><br /><br />
                          <a href={article.noteUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                            ⇒ note.com で続きを読む（外部リンク）
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </center>
              </div>

              <br />
              <hr />
              <center>
                <Link href="/">[ トップページへ戻る ]</Link>
              </center>
            </td>
          </tr>
        </tbody>
      </table>
    </center>
  );
}