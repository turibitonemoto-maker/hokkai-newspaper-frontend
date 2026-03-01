
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, ChevronLeft, Loader2, AlertCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const db = useFirestore();
  const { toast } = useToast();
  
  const articleRef = useMemoFirebase(() => {
    if (!id || !db) return null;
    return doc(db, 'articles', id);
  }, [db, id]);

  const { data: article, isLoading: isFetching } = useDoc(articleRef);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    htmlContent: '',
    categoryId: 'Campus',
    isPublished: true,
    mainImageUrl: '',
  });

  // 初回ロード時のみフォームを初期化
  useEffect(() => {
    if (article && !isInitialized) {
      setFormData({
        title: article.title || '',
        htmlContent: article.htmlContent || '',
        categoryId: article.categoryId || 'Campus',
        isPublished: article.isPublished ?? true,
        mainImageUrl: article.mainImageUrl || '',
      });
      setIsInitialized(true);
    }
  }, [article, isInitialized]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !articleRef || isSubmitting || !isInitialized) return;

    if (!formData.title || !formData.htmlContent) {
      toast({ title: "入力エラー", description: "タイトルと本文は必須です。", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    // updateDocumentNonBlocking を使用して「部分更新」
    // これにより、下書き保存時でも他のフィールド（noteUrl等）を破壊しません
    updateDocumentNonBlocking(articleRef, {
      title: formData.title,
      htmlContent: formData.htmlContent,
      categoryId: formData.categoryId,
      isPublished: formData.isPublished,
      mainImageUrl: formData.mainImageUrl,
      lastSyncedDate: new Date().toISOString(),
    });
    
    toast({ title: "更新開始", description: "保存処理を開始しました。" });
    
    setTimeout(() => {
      router.push('/admin');
    }, 1000);
  };

  if (isFetching && !isInitialized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">記事データをロード中...</p>
      </div>
    );
  }

  if (!article && !isFetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8 text-center bg-white rounded-[40px] shadow-xl">
        <AlertCircle size={48} className="text-destructive" />
        <h2 className="text-2xl font-black">記事が見つかりません</h2>
        <Button variant="outline" asChild><Link href="/admin">管理画面に戻る</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-xl">
            <Link href="/admin"><ChevronLeft size={20} /></Link>
          </Button>
          <h2 className="text-3xl font-black tracking-tight italic uppercase">記事編集</h2>
        </div>
        <Button variant="outline" asChild className="rounded-xl h-12 gap-2">
          <Link href={`/admin/preview/${id}`} target="_blank">
            <Eye size={16} /> プレビューを表示
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[32px] border-none shadow-xl">
            <CardHeader>
              <CardTitle>内容の編集</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-black text-[10px] uppercase tracking-widest">タイトル</Label>
                <Input
                  id="title"
                  value={formData.title}
                  className="rounded-xl h-12"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="font-black text-[10px] uppercase tracking-widest">本文 (HTML)</Label>
                <Textarea
                  id="content"
                  className="min-h-[500px] font-mono rounded-xl p-4"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[32px] border-none shadow-xl">
            <CardHeader><CardTitle className="text-lg">画像</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <Input
                placeholder="画像URL"
                value={formData.mainImageUrl}
                className="rounded-xl"
                onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
              />
              {formData.mainImageUrl && (
                <div className="aspect-video rounded-xl overflow-hidden border">
                  <img src={formData.mainImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-none shadow-xl">
            <CardHeader><CardTitle className="text-lg">公開設定</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Campus">学内ニュース</SelectItem>
                  <SelectItem value="Event">イベント</SelectItem>
                  <SelectItem value="Interview">インタビュー</SelectItem>
                  <SelectItem value="Sports">スポーツ</SelectItem>
                  <SelectItem value="Opinion">オピニオン</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.isPublished ? "true" : "false"} onValueChange={(val) => setFormData({ ...formData, isPublished: val === "true" })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">公開</SelectItem>
                  <SelectItem value="false">下書き</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-16 text-lg font-black rounded-2xl shadow-xl" disabled={isSubmitting || !isInitialized}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
            保存する
          </Button>
        </div>
      </form>
    </div>
  );
}
