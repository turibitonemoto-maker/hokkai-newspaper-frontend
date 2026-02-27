'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, ChevronLeft, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const db = useFirestore();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [helperImageUrl, setHelperImageUrl] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  const articleRef = useMemoFirebase(() => {
    if (!id || !db) return null;
    return doc(db, 'articles', id);
  }, [db, id]);

  const { data: article, isLoading: isFetching } = useDoc(articleRef);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    htmlContent: '',
    categoryId: 'Campus',
    isPublished: true,
    mainImageUrl: '',
  });

  // 記事データがロードされたら、初回のみフォームに確実にセットする
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

  const copyImageTag = () => {
    if (!helperImageUrl) return;
    const tag = `<img src="${helperImageUrl}" alt="記事内画像" className="rounded-2xl w-full my-8 shadow-lg" />`;
    navigator.clipboard.writeText(tag);
    setCopied(true);
    toast({ title: "コピー完了", description: "本文に貼り付けて使用してください。" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !articleRef || isSubmitting || !isInitialized) return;

    if (!formData.title || !formData.htmlContent) {
      toast({ title: "入力エラー", description: "タイトルと本文は必須です。", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    // updateDocumentNonBlocking を使用して「部分更新」を行うことで、既存のフィールドを保持する
    updateDocumentNonBlocking(articleRef, {
      ...formData,
      lastSyncedDate: new Date().toISOString(),
    });
    
    toast({ title: "更新保存中", description: "バックグラウンドで保存しています。" });
    router.push('/admin');
  };

  if (isFetching && !isInitialized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} strokeWidth={3} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">記事データを読み込んでいます...</p>
      </div>
    );
  }

  if (!article && !isFetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8 text-center bg-white rounded-[40px] shadow-xl">
        <div className="bg-destructive/10 p-5 rounded-full text-destructive">
          <AlertCircle size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">記事が見つかりません</h2>
          <p className="text-slate-500 font-bold mb-8">URLが間違っているか、削除された可能性があります。</p>
          <Button variant="outline" className="rounded-xl px-8 h-12" asChild>
            <Link href="/admin">管理画面に戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-xl shadow-sm">
          <Link href="/admin"><ChevronLeft size={20} /></Link>
        </Button>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 italic uppercase">記事編集</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Hokkai Gakuen University Newspaper CMS</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[32px] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-lg font-black">内容の編集</CardTitle>
              <CardDescription className="font-bold">タイトルと本文の内容を調整してください。</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="title" className="font-black text-slate-900 ml-1 uppercase text-[10px] tracking-widest">記事タイトル</Label>
                <Input
                  id="title"
                  value={formData.title}
                  placeholder="記事のタイトルを入力..."
                  className="rounded-2xl h-14 text-lg font-bold border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="content" className="font-black text-slate-900 ml-1 uppercase text-[10px] tracking-widest">本文 (HTML使用可)</Label>
                <Textarea
                  id="content"
                  className="min-h-[600px] font-mono text-sm rounded-2xl p-6 border-slate-100 bg-slate-50/50 focus:bg-white transition-all leading-relaxed"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[32px] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b border-slate-50">
              <CardTitle className="text-lg font-black">アイキャッチ画像</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainImageUrl" className="text-[10px] font-black uppercase tracking-widest text-slate-400">画像URL</Label>
                <Input
                  id="mainImageUrl"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.mainImageUrl}
                  className="rounded-xl bg-slate-50 border-slate-100"
                  onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
                />
                {formData.mainImageUrl && (
                  <div className="mt-4 aspect-video relative rounded-2xl overflow-hidden shadow-inner border border-slate-100 bg-slate-50">
                    <img src={formData.mainImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b border-slate-50">
              <CardTitle className="text-lg font-black">公開設定</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">カテゴリー</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                >
                  <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-slate-100 font-bold">
                    <SelectValue />
                  </SelectTrigger>
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
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">ステータス</Label>
                <Select
                  value={formData.isPublished ? "true" : "false"}
                  onValueChange={(val) => setFormData({ ...formData, isPublished: val === "true" })}
                >
                  <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-slate-100 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="true">公開（Live）</SelectItem>
                    <SelectItem value="false">下書き（Draft）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full h-16 text-lg font-black rounded-2xl shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all" 
            disabled={isSubmitting || !isInitialized}
          >
            {isSubmitting ? <Loader2 className="mr-2 animate-spin" size={24} /> : <Save className="mr-2" size={24} />}
            変更を保存する
          </Button>
        </div>
      </form>
    </div>
  );
}