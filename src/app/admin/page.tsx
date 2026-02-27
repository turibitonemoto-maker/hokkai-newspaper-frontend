'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink, RefreshCw, Loader2, Newspaper, ChevronRight } from 'lucide-react';
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
import { deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const articlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'articles'));
  }, [db]);

  const { data: articles, isLoading } = useCollection(articlesRef);

  const sortedArticles = articles 
    ? [...articles].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    : [];

  const handleDelete = (id: string) => {
    if (!db) return;
    const docRef = doc(db, 'articles', id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "削除完了", description: "記事を完全に削除しました。" });
  };

  const handleSyncNote = async () => {
    if (!db || isSyncing) return;
    setIsSyncing(true);
    
    toast({ 
      title: "同期開始", 
      description: "noteから最新記事を読み込んでいます...",
    });

    try {
      const result = await fetchAndSyncNoteRss();
      
      if (result.success && result.articles) {
        if (result.articles.length === 0) {
          toast({ title: "同期完了", description: "新しい記事はありませんでした。" });
          setIsSyncing(false);
          return;
        }

        for (const article of result.articles) {
          const docRef = doc(db, 'articles', article.id);
          setDocumentNonBlocking(docRef, article, { merge: true });
        }
        
        toast({ 
          title: "同期リクエスト完了", 
          description: `${result.articles.length}件の記事の保存処理を開始しました。`,
        });
      } else {
        throw new Error(result.error || '不明なエラーが発生しました');
      }
    } catch (e: any) {
      toast({ 
        title: "同期エラー", 
        description: e.message || "noteとの通信に失敗しました。", 
        variant: "destructive" 
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">記事管理</h2>
          <p className="text-slate-500 mt-1 font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em]">Hokkai Gakuen University Newspaper CMS</p>
        </div>
        <div className="flex w-full md:w-auto gap-2 md:gap-4">
          <Button 
            variant="outline" 
            onClick={handleSyncNote} 
            disabled={isSyncing} 
            className="flex-1 md:flex-none gap-2 h-12 md:h-14 px-4 md:px-8 border-slate-200 bg-white hover:bg-slate-50 transition-all active:scale-95 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            NOTE同期
          </Button>
          <Button asChild className="flex-1 md:flex-none gap-2 h-12 md:h-14 px-4 md:px-10 shadow-xl md:shadow-2xl shadow-primary/30 active:scale-95 transition-all rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs">
            <Link href="/admin/new">
              <Plus size={18} strokeWidth={3} />
              新規作成
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
        <Card className="bg-primary text-primary-foreground border-none shadow-xl md:shadow-2xl shadow-primary/20 overflow-hidden relative rounded-2xl md:rounded-[32px]">
          <CardHeader className="pb-1 md:pb-2 relative z-10 p-4 md:p-8">
            <CardTitle className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-70">Total Stories</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-4 md:p-8 pt-0">
            <div className="text-3xl md:text-7xl font-black tracking-tighter">{articles?.length || 0}</div>
          </CardContent>
          <Newspaper className="absolute -right-4 -bottom-4 md:-right-6 md:-bottom-6 opacity-10 rotate-12" size={80} />
        </Card>
        <Card className="border-none bg-white shadow-lg md:shadow-xl shadow-slate-200/50 rounded-2xl md:rounded-[32px] overflow-hidden">
          <CardHeader className="pb-1 md:pb-2 p-4 md:p-8">
            <CardTitle className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400">Live</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-8 pt-0">
            <div className="text-3xl md:text-7xl font-black text-slate-900 tracking-tighter">{articles?.filter(a => a.isPublished).length || 0}</div>
          </CardContent>
        </Card>
        <Card className="hidden md:block border-none bg-white shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
          <CardHeader className="pb-2 p-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Note Sources</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="text-7xl font-black text-slate-900 tracking-tighter">{articles?.filter(a => a.source === 'note').length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* PC版: 表形式で表示 */}
      <div className="hidden md:block">
        <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden bg-white rounded-[40px]">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] py-8 pl-10 text-slate-400">Story Title</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] py-8 text-slate-400">Platform</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] py-8 text-slate-400">Publish Date</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] py-8 text-slate-400">Status</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-[0.2em] py-8 pr-10 text-slate-400">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32">
                    <div className="flex flex-col items-center gap-6">
                      <Loader2 className="animate-spin text-primary" size={48} strokeWidth={3} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Synchronizing with Cloud</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedArticles.length > 0 ? (
                sortedArticles.map((article) => (
                  <TableRow key={article.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                    <TableCell className="font-black text-slate-900 max-w-xs md:max-w-md py-6 pl-10">
                      <div className="truncate group-hover:text-primary transition-colors text-base">{article.title}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${article.source === 'note' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {article.source?.toUpperCase() || 'INTERNAL'}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm font-bold">
                      {article.publishDate?.split('T')[0]}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${article.isPublished ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${article.isPublished ? 'text-green-600' : 'text-slate-400'}`}>
                          {article.isPublished ? 'Live' : 'Draft'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all" asChild>
                          <Link href={`/articles/${article.id}`}>
                            <ExternalLink size={18} />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all" asChild>
                          <Link href={`/admin/edit/${article.id}`}>
                            <Edit size={18} />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-destructive hover:bg-destructive/10 transition-all">
                              <Trash2 size={18} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[32px]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-black text-xl">記事を削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription className="font-medium">
                                この操作は取り消せません。サイトからこの記事が完全に削除されます。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2">
                              <AlertDialogCancel className="rounded-xl font-bold">キャンセル</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(article.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold"
                              >
                                削除する
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-48 bg-slate-50/20">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-white shadow-xl shadow-slate-200/50 rounded-[32px] flex items-center justify-center mb-8">
                        <Newspaper className="text-slate-200" size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">管理対象の記事がありません</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Create your first story or sync from Note</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* スマホ版: カード形式で表示（見やすさ向上のため） */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Loading...</p>
          </div>
        ) : sortedArticles.length > 0 ? (
          sortedArticles.map((article) => (
            <Card key={article.id} className="border-none shadow-md rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${article.source === 'note' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {article.source || 'INTERNAL'}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${article.isPublished ? 'bg-green-500' : 'bg-slate-300'}`} />
                    </div>
                    <h3 className="font-black text-slate-900 leading-tight line-clamp-2">{article.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400">{article.publishDate?.split('T')[0]}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl h-10 font-black text-[10px] gap-2" asChild>
                    <Link href={`/admin/edit/${article.id}`}>
                      <Edit size={14} /> 編集
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl h-10 font-black text-[10px] gap-2 text-destructive border-destructive/20 hover:bg-destructive/5">
                        <Trash2 size={14} /> 削除
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl w-[90vw] max-w-sm">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-black">削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>この操作は取り消せません。</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col gap-2 mt-4">
                        <AlertDialogAction onClick={() => handleDelete(article.id)} className="bg-destructive text-white rounded-xl font-bold w-full h-12">削除する</AlertDialogAction>
                        <AlertDialogCancel className="rounded-xl font-bold w-full h-12 m-0">キャンセル</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50" asChild>
                    <Link href={`/articles/${article.id}`}>
                      <ExternalLink size={16} />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Newspaper className="mx-auto text-slate-200 mb-4" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">記事がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
