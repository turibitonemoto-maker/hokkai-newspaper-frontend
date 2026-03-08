
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

  // 記事データが届いたらフォームを初期化
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
    
    // updateDocumentNonBlocking を使用して「差分のみ」を送信
    // これにより、既存の noteUrl や publishDate を壊さずに更新
    updateDocumentNonBlocking(articleRef, {
      title: formData.title,
      htmlContent: formData.htmlContent,
      categoryId: formData.categoryId,
      isPublished: formData.isPublished,
      mainImageUrl: formData.mainImageUrl,
      lastSyncedDate: new Date().toISOString(),
    });
    
    toast({ title: "保存開始", description: "バックグラウンドで更新を行っています。" });
    
    setTimeout(() => {
      router.push('/admin');
    }, 800);
  };

  if (isFetching && !isInitialized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} strokeWidth={3} />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">記事データを取得中...</p>
      </div>
    );
  }

  if (!article && !isFetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8 text-center bg-white rounded-[40px] shadow-xl">
        <AlertCircle size={48} className="text-destructive" />
        <h2 className="text-2xl font-black">記事が見つかりません</h2>
        <Button variant="outline" asChild className="rounded-xl"><Link href="/admin">管理一覧に戻る</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-xl shadow-sm">
            <Link href="/admin"><ChevronLeft size={20} /></Link>
          </Button>
          <h2 className="text-3xl font-black tracking-tight italic uppercase">記事を編集</h2>
        </div>
        <Button variant="outline" asChild className="rounded-xl h-12 gap-2 shadow-sm">
          <Link href={`/admin/preview/${id}`} target="_blank">
            <Eye size={16} /> プレビュー
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[40px] border-none shadow-2xl bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Content editor</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="title" className="font-black text-[10px] uppercase tracking-widest ml-1">タイトル</Label>
                <Input
                  id="title"
                  value={formData.title}
                  className="rounded-2xl h-14 text-lg font-bold border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="content" className="font-black text-[10px] uppercase tracking-widest ml-1">本文 (HTML)</Label>
                <Textarea
                  id="content"
                  className="min-h-[600px] font-mono rounded-2xl p-6 border-slate-100 bg-slate-50/50 focus:bg-white transition-all leading-relaxed"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[32px] border-none shadow-xl bg-white">
            <CardHeader><CardTitle className="text-lg font-black uppercase tracking-tight">Image</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <Input
                placeholder="画像URL"
                value={formData.mainImageUrl}
                className="rounded-xl border-slate-100"
                onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
              />
              {formData.mainImageUrl && (
                <div className="aspect-video rounded-2xl overflow-hidden border shadow-inner">
                  <img src={formData.mainImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-none shadow-xl bg-white">
            <CardHeader><CardTitle className="text-lg font-black uppercase tracking-tight">Settings</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">カテゴリー</Label>
                <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                  <SelectTrigger className="rounded-xl border-slate-100 h-12"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Campus">学内ニュース</SelectItem>
                    <SelectItem value="Event">イベント</SelectItem>
                    <SelectItem value="Interview">インタビュー</SelectItem>
                    <SelectItem value="Sports">スポーツ</SelectItem>
                    <SelectItem value="Opinion">オピニオン</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">公開設定</Label>
                <Select value={formData.isPublished ? "true" : "false"} onValueChange={(val) => setFormData({ ...formData, isPublished: val === "true" })}>
                  <SelectTrigger className="rounded-xl border-slate-100 h-12"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="true">公開する</SelectItem>
                    <SelectItem value="false">下書きとして保存</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-20 text-xl font-black rounded-3xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isSubmitting || !isInitialized}>
            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Save className="mr-3" size={24} />}
            内容を保存
          </Button>
        </div>
      </form>
    </div>
  );
}
