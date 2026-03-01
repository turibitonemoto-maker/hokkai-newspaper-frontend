'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, RefreshCw, Loader2, Newspaper, Eye, LayoutDashboard } from 'lucide-react';
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

  // ログイン状態を待たずに即座に全記事を取得（認証ガードを解除）
  const articlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'articles'), orderBy('publishDate', 'desc'));
  }, [db]);

  const { data: articles, isLoading: isCollectionLoading } = useCollection(articlesRef);

  const handleDelete = (id: string) => {
    if (!db) return;
    const docRef = doc(db, 'articles', id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "削除完了", description: "記事を削除しました。" });
  };

  const handleSyncNote = async () => {
    if (!db || isSyncing) return;
    setIsSyncing(true);
    toast({ title: "同期開始", description: "noteから最新記事を読み込んでいます..." });

    try {
      const result = await fetchAndSyncNoteRss();
      if (result.success && result.articles) {
        let updateCount = 0;
        for (const article of result.articles) {
          if (!article.htmlContent) continue;
          const docRef = doc(db, 'articles', article.id);
          setDocumentNonBlocking(docRef, article, { merge: true });
          updateCount++;
        }
        toast({ title: "同期完了", description: `${updateCount}件の記事を更新しました。` });
      } else {
        throw new Error(result.error);
      }
    } catch (e: any) {
      toast({ title: "同期エラー", description: e.message, variant: "destructive" });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-2xl text-white">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">記事管理</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Admin Console (Access Open)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSyncNote} disabled={isSyncing} className="rounded-2xl h-12 px-6 font-black text-xs">
            {isSyncing ? <Loader2 className="animate-spin" /> : <RefreshCw className="mr-2" size={16} />}
            NOTE同期
          </Button>
          <Button asChild className="rounded-2xl h-12 px-8 font-black text-xs shadow-xl shadow-primary/20">
            <Link href="/admin/new"><Plus className="mr-2" size={18} /> 新規作成</Link>
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[40px]">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-8 pl-10">記事タイトル</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-8">元サイト</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-8">日付</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-8 text-right pr-10">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isCollectionLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-primary" /></TableCell></TableRow>
            ) : articles && articles.length > 0 ? (
              articles.map((article) => (
                <TableRow key={article.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-black py-6 pl-10 truncate max-w-md">{article.title}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-xl text-[9px] font-black bg-slate-100 uppercase">{article.source || 'INTERNAL'}</span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm font-bold">{article.publishDate?.split('T')[0]}</TableCell>
                  <TableCell className="text-right pr-10">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild><Link href={`/admin/preview/${article.id}`} target="_blank"><Eye size={18} /></Link></Button>
                      <Button variant="ghost" size="icon" asChild><Link href={`/admin/edit/${article.id}`}><Edit size={18} /></Link></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={18} /></Button></AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[32px]">
                          <AlertDialogHeader><AlertDialogTitle>記事を削除しますか？</AlertDialogTitle></AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(article.id)} className="bg-destructive">削除する</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400">記事がありません</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}