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
import { Save, ChevronLeft, Loader2, Copy, Check } from 'lucide-react';
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

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        htmlContent: article.htmlContent || '',
        categoryId: article.categoryId || 'Campus',
        isPublished: article.isPublished ?? true,
        mainImageUrl: article.mainImageUrl || '',
      });
    }
  }, [article]);

  const copyImageTag = () => {
    if (!helperImageUrl) return;
    const tag = `<img src="${helperImageUrl}" alt="記事内画像" className="rounded-2xl w-full my-8 shadow-lg" />`;
    navigator.clipboard.writeText(tag);
    setCopied(true);
    toast({ title: "コピー完了", description: "本文に貼り付けて使用してください。" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !articleRef || isSubmitting) return;

    setIsSubmitting(true);
    updateDocumentNonBlocking(articleRef, {
      ...formData,
      lastSyncedDate: new Date().toISOString(),
    });
    
    toast({ title: "更新完了", description: "記事の内容を保存しました。" });
    router.push('/admin');
    setIsSubmitting(false);
  };

  if (isFetching) return <div className="p-8 text-center flex flex-col items-center gap-4"><Loader2 className="animate-spin text-primary" size={32} /> 読み込み中...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-xl">
          <Link href="/admin"><ChevronLeft size={20} /></Link>
        </Button>
        <h2 className="text-3xl font-black tracking-tight">記事編集</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[32px] border-none shadow-xl bg-white">
            <CardHeader>
              <CardTitle>内容の編集</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">記事タイトル</Label>
                <Input
                  id="title"
                  value={formData.title}
                  className="rounded-xl h-12"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">本文 (HTML使用可)</Label>
                <Textarea
                  id="content"
                  className="min-h-[500px] font-mono text-sm rounded-xl leading-relaxed"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[32px] border-none shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-lg">メイン画像設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainImageUrl">アイキャッチ画像URL</Label>
                <Input
                  id="mainImageUrl"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.mainImageUrl}
                  className="rounded-xl"
                  onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
                />
                {formData.mainImageUrl && (
                  <div className="mt-2 aspect-video relative rounded-xl overflow-hidden border">
                    <img src={formData.mainImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-none shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-lg">本文内の画像埋め込み</CardTitle>
              <CardDescription>画像を本文の中に差し込むためのタグを作成します。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>画像URLを貼り付け</Label>
                <Input
                  placeholder="画像のURLを入力"
                  value={helperImageUrl}
                  className="rounded-xl"
                  onChange={(e) => setHelperImageUrl(e.target.value)}
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full rounded-xl gap-2 font-bold"
                onClick={copyImageTag}
                disabled={!helperImageUrl}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                埋め込みタグをコピー
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-none shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-lg">設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>カテゴリー</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                >
                  <SelectTrigger className="rounded-xl">
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
                <Label>公開ステータス</Label>
                <Select
                  value={formData.isPublished ? "true" : "false"}
                  onValueChange={(val) => setFormData({ ...formData, isPublished: val === "true" })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="true">公開</SelectItem>
                    <SelectItem value="false">下書き</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 animate-spin" size={20} /> : <Save className="mr-2" size={20} />}
            更新を保存する
          </Button>
        </div>
      </form>
    </div>
  );
}