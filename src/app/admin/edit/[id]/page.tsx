'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams();
  const db = useFirestore();
  const { toast } = useToast();
  
  const articleRef = id && db ? doc(db, 'articles', id as string) : null;
  const { data: article, isLoading: isFetching } = useDoc(articleRef);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    htmlContent: '',
    categoryId: 'Campus',
    isPublished: true,
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        htmlContent: article.htmlContent || '',
        categoryId: article.categoryId || 'Campus',
        isPublished: article.isPublished ?? true,
      });
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !articleRef || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateDoc(articleRef, {
        ...formData,
        lastSyncedDate: new Date().toISOString(),
      });
      toast({ title: "更新完了", description: "記事を更新しました。" });
      router.push('/admin');
    } catch (e) {
      toast({ title: "エラー", description: "更新に失敗しました。", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) return <div className="p-8 text-center">読み込み中...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin"><ChevronLeft size={20} /></Link>
        </Button>
        <h2 className="text-3xl font-bold">記事編集</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">記事タイトル</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label>公開設定</Label>
                <Select
                  value={formData.isPublished ? "true" : "false"}
                  onValueChange={(val) => setFormData({ ...formData, isPublished: val === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">公開する</SelectItem>
                    <SelectItem value="false">下書き保存</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">本文</Label>
              <Textarea
                id="content"
                className="min-h-[400px]"
                value={formData.htmlContent}
                onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.push('/admin')}>キャンセル</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Save className="mr-2" size={18} />}
            更新を保存する
          </Button>
        </div>
      </form>
    </div>
  );
}
