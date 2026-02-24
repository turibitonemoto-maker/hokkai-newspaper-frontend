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

  if (isLoading) return <div className="container">読み込み中...</div>;
  if (!article) return <div className="container">記事が見つかりません。<br /><Link href="/">トップへ戻る</Link></div>;

  return (
    <div className="container">
      <nav style={{ marginBottom: '10px' }}>
        <Link href="/">トップ</Link> ＞ {article.title}
      </nav>

      <article>
        <h1>{article.title}</h1>
        <div style={{ fontSize: '0.8rem', marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
          公開日: {article.publishDate.split('T')[0]} | 
          <a href={article.noteUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px' }}>
            note.comで全文を読む
          </a>
        </div>
        
        <div style={{ whiteSpace: 'pre-wrap', padding: '10px 0' }}>
          {article.excerpt}
          <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
            ※全文は上のリンクからnote.comでご確認ください。
          </p>
        </div>
      </article>

      <footer style={{ marginTop: '30px', borderTop: '1px solid #000', textAlign: 'center' }}>
        <Link href="/">トップページへ戻る</Link>
      </footer>
    </div>
  );
}