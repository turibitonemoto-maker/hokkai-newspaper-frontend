'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">記事管理</h2>
          <p className="text-muted-foreground">作成した記事の編集や削除が行えます。</p>
        </div>
        <Button asChild>
          <Link href="/admin/new" className="gap-2">
            <Plus size={18} />
            新規記事作成
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>タイトル</TableHead>
              <TableHead>カテゴリー</TableHead>
              <TableHead>公開日</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">読み込み中...</TableCell>
              </TableRow>
            ) : articles && articles.length > 0 ? (
              articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.categoryId}</TableCell>
                  <TableCell>{article.publishDate.split('T')[0]}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${article.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {article.isPublished ? '公開中' : '下書き'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/articles/${article.id}`} target="_blank">
                        <ExternalLink size={16} />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/edit/${article.id}`}>
                        <Edit size={16} />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(article.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">記事がありません。「新規記事作成」から追加してください。</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
