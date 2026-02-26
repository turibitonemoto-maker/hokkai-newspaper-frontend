'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc, setDoc, query, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink, RefreshCw, Loader2, Newspaper } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const articlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'articles'), limit(100));
  }, [db]);

  const { data: articles, isLoading } = useCollection(articlesRef);

  const sortedArticles = articles 
    ? [...articles].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    : [];

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
          // 既存の記事を上書きまたは新規作成
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">記事管理</h2>
          <p className="text-slate-500 mt-1">手動作成した記事とnoteから同期した記事を一覧で管理できます。</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSyncNote} disabled={isSyncing} className="gap-2 h-11 px-5 border-slate-200">
            {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
            noteから同期
          </Button>
          <Button asChild className="gap-2 h-11 px-6 shadow-lg shadow-primary/20">
            <Link href="/admin/new">
              <Plus size={20} />
              新規記事作成
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Total Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{articles?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{articles?.filter(a => a.isPublished).length || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{articles?.filter(a => !a.isPublished).length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Article Title</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Source</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Date</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Status</TableHead>
              <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Database...</p>
                </TableCell>
              </TableRow>
            ) : sortedArticles.length > 0 ? (
              sortedArticles.map((article) => (
                <TableRow key={article.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-bold text-slate-900 max-w-xs md:max-w-md">
                    <div className="truncate">{article.title}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${article.source === 'note' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {article.source || 'Internal'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm font-medium">
                    {article.publishDate?.split('T')[0]}
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${article.isPublished ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                      {article.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild title="表示">
                        <Link href={`/articles/${article.id}`}>
                          <ExternalLink size={14} />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild title="編集">
                        <Link href={`/admin/edit/${article.id}`}>
                          <Edit size={14} />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10" onClick={() => handleDelete(article.id)} title="削除">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24 bg-slate-50/30">
                  <Newspaper className="mx-auto mb-4 text-slate-200" size={48} />
                  <p className="text-slate-400 font-bold">記事が見つかりませんでした。</p>
                  <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Add your first story to get started</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
