'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, ChevronLeft, Loader2, Image as ImageIcon, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function NewArticlePage() {
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [helperImageUrl, setHelperImageUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    htmlContent: '',
    categoryId: 'Campus',
    isPublished: true,
    mainImageUrl: '',
  });

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
    if (!db || isSubmitting) return;

    if (!formData.title || !formData.htmlContent) {
      toast({ title: "入力エラー", description: "タイトルと本文は必須です。", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const articlesCol = collection(db, 'articles');
    const newDocRef = doc(articlesCol);
    const id = newDocRef.id;

    setDocumentNonBlocking(newDocRef, {
      ...formData,
      id: id,
      publishDate: new Date().toISOString(),
      lastSyncedDate: new Date().toISOString(),
      authorName: '北海学園大学新聞',
      source: 'internal'
    }, { merge: true });

    toast({ title: "保存開始", description: "記事の保存処理を開始しました。" });
    router.push('/admin');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-xl">
          <Link href="/admin"><ChevronLeft size={20} /></Link>
        </Button>
        <h2 className="text-3xl font-black tracking-tight">新規記事作成</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[32px] border-none shadow-xl bg-white">
            <CardHeader>
              <CardTitle>内容の編集</CardTitle>
              <CardDescription>タイトルと記事の本文（HTML形式）を入力してください。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">記事タイトル</Label>
                <Input
                  id="title"
                  placeholder="例：北海学園大学、新キャンパス棟の建設を計画"
                  value={formData.title}
                  className="rounded-xl h-12"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content">本文 (HTML使用可)</Label>
                </div>
                <Textarea
                  id="content"
                  placeholder="記事の詳細を入力してください..."
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
              <CardTitle className="text-lg">公開設定</CardTitle>
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
            記事を保存する
          </Button>
        </div>
      </form>
    </div>
  );
}