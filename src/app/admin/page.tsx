'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc, setDoc, query, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink, RefreshCw, Loader2, Newspaper, CheckCircle2 } from 'lucide-react';
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
    
    toast({ 
      title: "同期開始", 
      description: "noteから最新の記事を取得しています...",
    });

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
        toast({ 
          title: "同期完了", 
          description: `${count}件の記事を同期・更新しました。`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (e: any) {
      toast({ 
        title: "同期エラー", 
        description: e.message || "同期に失敗しました。", 
        variant: "destructive" 
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">記事管理</h2>
          <p className="text-slate-500 mt-1 font-medium">手動作成した記事とnoteから同期した記事を一覧で管理できます。</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleSyncNote} 
            disabled={isSyncing} 
            className="gap-2 h-11 px-5 border-slate-200 bg-white hover:bg-slate-50 transition-all active:scale-95"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
            noteから同期
          </Button>
          <Button asChild className="gap-2 h-11 px-6 shadow-lg shadow-primary/20 active:scale-95 transition-all">
            <Link href="/admin/new">
              <Plus size={20} />
              新規記事作成
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/10 overflow-hidden relative">
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Total Stories</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-5xl font-black">{articles?.length || 0}</div>
          </CardContent>
          <Newspaper className="absolute -right-4 -bottom-4 opacity-10 rotate-12" size={120} />
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black text-slate-900">{articles?.filter(a => a.isPublished).length || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black text-slate-900">{articles?.filter(a => !a.isPublished).length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden bg-white rounded-3xl">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-6 pl-8">Article Title</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-6">Source</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-6">Date</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-6">Status</TableHead>
              <TableHead className="text-right font-black text-[10px] uppercase tracking-widest py-6 pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin mb-4 text-primary" size={40} />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing Database</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedArticles.length > 0 ? (
              sortedArticles.map((article) => (
                <TableRow key={article.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                  <TableCell className="font-bold text-slate-900 max-w-xs md:max-w-md py-5 pl-8">
                    <div className="truncate group-hover:text-primary transition-colors">{article.title}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm ${article.source === 'note' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'}`}>
                      {article.source || 'Internal'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm font-bold">
                    {article.publishDate?.split('T')[0]}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${article.isPublished ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${article.isPublished ? 'text-green-600' : 'text-slate-400'}`}>
                        {article.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-all" asChild>
                        <Link href={`/articles/${article.id}`}>
                          <ExternalLink size={16} />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-all" asChild>
                        <Link href={`/admin/edit/${article.id}`}>
                          <Edit size={16} />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 transition-all" onClick={() => handleDelete(article.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-32 bg-slate-50/30">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                      <Newspaper className="text-slate-300" size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">記事がありません</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Add your first story or sync from Note</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
