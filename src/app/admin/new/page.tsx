"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/mock-data';
import { generateArticleSummary } from '@/ai/flows/generate-article-summary-flow';
import { Sparkles, Save, Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NewArticlePage() {
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState('新聞会 管理者');

  const handleGenerateSummary = async () => {
    if (!content) {
      toast({
        title: "エラー",
        description: "要約を生成するには記事本文を入力してください。",
        variant: "destructive"
      });
      return;
    }

    setIsSummarizing(true);
    try {
      const result = await generateArticleSummary({ articleContent: content });
      setSummary(result.summary);
      toast({
        title: "完了",
        description: "AIによる要約が生成されました。",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "要約の生成に失敗しました。時間をおいて再度お試しください。",
        variant: "destructive"
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handlePublish = () => {
    // In a real app, this would be a server action
    toast({
      title: "公開完了",
      description: "記事が正常に公開されました。",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">新規記事作成</h2>
          <p className="text-muted-foreground">魅力的な記事を作成して、学園生活を発信しましょう。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast({ title: "下書き保存", description: "下書きとして保存しました。" })}>
            <Save size={18} className="mr-2" />
            下書き
          </Button>
          <Button onClick={handlePublish}>
            <Send size={18} className="mr-2" />
            公開する
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Main Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>本文エディタ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">記事タイトル</Label>
                <Input 
                  id="title" 
                  placeholder="読者の目を引くタイトルを入力..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-bold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">本文</Label>
                <Textarea 
                  id="content" 
                  placeholder="ここから記事を書き始めましょう..." 
                  className="min-h-[400px] leading-relaxed resize-y"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>AI要約</CardTitle>
                <CardDescription>記事の概要を自動生成します。</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateSummary}
                disabled={isSummarizing || !content}
                className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
              >
                {isSummarizing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                要約を生成
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="AIによって生成された要約がここに表示されます..." 
                className="bg-muted/50 font-medium italic"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Settings Sidebar Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>記事設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>カテゴリー</Label>
                <Select onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">著者名</Label>
                <Input 
                  id="author" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>アイキャッチ画像</Label>
                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                  <ImageIcon className="text-muted-foreground" size={32} />
                  <p className="text-xs text-muted-foreground font-medium">クリックして画像をアップロード</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>プレビュー</CardTitle>
              <CardDescription>公開前の表示イメージ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded border p-4 bg-muted/10 space-y-2">
                <div className="w-full aspect-video bg-muted rounded mb-2 flex items-center justify-center">
                  <ImageIcon className="text-muted-foreground/30" />
                </div>
                <h4 className="font-bold text-sm line-clamp-2">{title || 'タイトル未入力'}</h4>
                <p className="text-[10px] text-muted-foreground">{category || 'カテゴリー未設定'} • {author}</p>
                <p className="text-[10px] line-clamp-2 text-muted-foreground/80">{content.substring(0, 100)}...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}