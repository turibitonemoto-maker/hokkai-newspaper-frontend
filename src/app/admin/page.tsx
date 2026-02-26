'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAndSyncNoteRss } from '@/app/actions/sync-note';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const articlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'articles');
  }, [db]);

  const { data: articles, isLoading } = useCollection(articlesRef);

  const handleDelete = async (id: string) => {
    if (!db || !confirm('本当にこの記事を削除しますか？')) return;
    try {
      await deleteDoc(doc(db, 'articles', id));
      toast({ title: "削除完了", description: "記事を削除しました。" });
    } catch (e) {
      toast({ title: "エラー", description: "削除に失敗しました。", variant: "destructive" });
    }
  };

  const handleSyncNote = async () => {
    if (!db || isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await fetchAndSyncNoteRss();
      if (result.success && result.articles) {
        let count = 0;
        for (const article of result.articles) {
          const docRef = doc(db, 'articles', article.id);
          // IDを指定して保存（重複を防ぐ）
          await setDoc(docRef, article, { merge: true });
          count++;
        }
        toast({ title: "同期完了", description: `${count}件の記事をnoteから同期しました。` });
      } else {
        throw new Error(result.error);
      }
    } catch (e: any) {
      toast({ title: "同期エラー", description: e.message || "同期に失敗しました。", variant: "destructive" });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">記事管理</h2>
          <p className="text-muted-foreground">手動作成した記事とnoteから同期した記事を管理できます。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSyncNote} disabled={isSyncing} className="gap-2">
            {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
            noteから同期
          </Button>
          <Button asChild>
            <Link href="/admin/new" className="gap-2">
              <Plus size={18} />
              新規記事作成
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">タイトル</TableHead>
              <TableHead className="font-bold">情報源</TableHead>
              <TableHead className="font-bold">公開日</TableHead>
              <TableHead className="font-bold">状態</TableHead>
              <TableHead className="text-right font-bold">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Loader2 className="animate-spin mx-auto mb-2 text-primary" />
                  読み込み中...
                </TableCell>
              </TableRow>
            ) : articles && articles.length > 0 ? (
              articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).map((article) => (
                <TableRow key={article.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-bold text-slate-900 max-w-xs md:max-w-md truncate">
                    {article.title}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${article.source === 'note' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {article.source || '内部'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {article.publishDate?.split('T')[0]}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${article.isPublished ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                      {article.isPublished ? '公開中' : '下書き'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" asChild title="表示">
                      <Link href={`/articles/${article.id}`} target="_blank">
                        <ExternalLink size={16} />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="編集">
                      <Link href={`/admin/edit/${article.id}`}>
                        <Edit size={16} />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(article.id)} title="削除">
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                  記事がありません。「新規記事作成」または「noteから同期」をクリックしてください。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
