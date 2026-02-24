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

  if (isLoading) return <center>読み込み中...</center>;
  if (!article) return <center>記事が見つかりません。<br /><Link href="/">トップへ戻る</Link></center>;

  return (
    <center>
      <table width="800" border={0} cellPadding={10} style={{ textAlign: 'left' }}>
        <tbody>
          <tr>
            <td>
              <Link href="/">トップ</Link> ＞ 記事閲覧
              <hr />
              <h1>{article.title}</h1>
              <p><font size="2">公開日: {article.publishDate.split('T')[0]} | カテゴリ: {article.categoryId}</font></p>
              <hr />
              
              <div style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
                {article.excerpt}
                <br /><br />
                <center>
                  <table border={1} cellPadding={10} style={{ backgroundColor: '#ffffcc' }}>
                    <tbody>
                      <tr>
                        <td>
                          <b>この記事の続きは note.com でご覧いただけます</b><br /><br />
                          <a href={article.noteUrl} target="_blank" rel="noopener noreferrer">
                            ⇒ note.com で全文を読む
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </center>
              </div>

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