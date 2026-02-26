'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { generateArticleSummary } from '@/ai/flows/generate-article-summary-flow';

export default function NewArticlePage() {
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    htmlContent: '',
    summary: '',
    categoryId: 'Campus',
    isPublished: true,
  });

  const handleAiSummary = async () => {
    if (!formData.htmlContent) {
      toast({ title: "エラー", description: "本文を入力してください。", variant: "destructive" });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await generateArticleSummary({ articleContent: formData.htmlContent });
      setFormData({ ...formData, summary: result.summary });
      toast({ title: "AI要約完了", description: "本文から要約を生成しました。" });
    } catch (e) {
      toast({ title: "AIエラー", description: "要約の生成に失敗しました。", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || isSubmitting) return;

    if (!formData.title || !formData.htmlContent) {
      toast({ title: "入力エラー", description: "タイトルと本文は必須です。", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'articles'), {
        ...formData,
        publishDate: new Date().toISOString(),
        lastSyncedDate: new Date().toISOString(),
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        authorIds: ['newspaper-club'],
      });
      toast({ title: "保存完了", description: "記事を公開しました。" });
      router.push('/admin');
    } catch (e) {
      toast({ title: "エラー", description: "保存に失敗しました。", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin"><ChevronLeft size={20} /></Link>
        </Button>
        <h2 className="text-3xl font-black tracking-tight">新規記事作成</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>本文の編集</CardTitle>
              <CardDescription>記事の内容を入力してください。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">記事タイトル</Label>
                <Input
                  id="title"
                  placeholder="例：北海学園大学、新キャンパス棟の建設を計画"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">本文 (HTML使用可)</Label>
                <Textarea
                  id="content"
                  placeholder="記事の詳細を入力してください..."
                  className="min-h-[500px] font-mono text-sm"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>カテゴリー</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">公開（読者に表示）</SelectItem>
                    <SelectItem value="false">下書き（非公開）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold">AI要約</CardTitle>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-primary h-8 gap-1"
                onClick={handleAiSummary}
                disabled={isAiLoading}
              >
                {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                自動生成
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="AIが生成した要約がここに表示されます..."
                className="text-xs h-32 leading-relaxed"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 animate-spin" size={20} /> : <Save className="mr-2" size={20} />}
            記事を保存する
          </Button>
        </div>
      </form>
    </div>
  );
}