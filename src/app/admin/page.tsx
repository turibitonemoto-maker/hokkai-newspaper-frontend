'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { fetchNoteRss } from '@/app/actions/sync-note';
import { useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, LayoutDashboard, FileText, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  const handleSync = async () => {
    if (!db) return;
    setIsSyncing(true);
    
    const result = await fetchNoteRss();
    
    if (result.success && result.articles) {
      try {
        for (const article of result.articles) {
          const docRef = doc(db, 'articles', article.id);
          await setDoc(docRef, {
            id: article.id,
            title: article.title,
            noteUrl: article.noteUrl,
            excerpt: article.excerpt,
            publishDate: new Date(article.publishDate).toISOString(),
            lastSyncedDate: new Date().toISOString(),
            isPublished: true,
            categoryId: 'Campus', // デフォルト
            authorIds: ['newspaper-club'],
            htmlContent: article.excerpt, // RSSからは全文取得が難しいため一旦抜粋
          }, { merge: true });
        }
        
        toast({
          title: "同期完了",
          description: `${result.articles.length}件の記事を同期しました。`,
        });
      } catch (e) {
        toast({
          title: "エラー",
          description: "データベースへの保存に失敗しました。",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "エラー",
        description: result.error || "同期に失敗しました。",
        variant: "destructive"
      });
    }
    
    setIsSyncing(false);
  };

  return (
    <div className="container">
      <h1>管理者メニュー</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button onClick={handleSync} disabled={isSyncing} className="gap-2">
          <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
          note.comから最新記事を同期する
        </Button>
        <Button asChild variant="outline">
          <Link href="/">サイトを表示</Link>
        </Button>
      </div>

      <table style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>機能</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>note同期</td>
            <td>lucky_minnow287 の最新記事を取り込みます。</td>
          </tr>
          <tr>
            <td>記事管理</td>
            <td>Firestore内の記事を編集・削除します（準備中）。</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}