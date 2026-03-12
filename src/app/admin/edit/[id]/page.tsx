'use client';

import { use } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, ChevronLeft, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  
  const articleRef = useMemoFirebase(() => {
    if (!id || !db) return null;
    return doc(db, 'articles', id);
  }, [db, id]);

  const { data: article, isLoading } = useDoc(articleRef);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} strokeWidth={3} />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">記事を読み込み中...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8 text-center bg-white rounded-[40px] shadow-xl">
        <AlertCircle size={48} className="text-destructive" />
        <h2 className="text-2xl font-black">記事が見つかりません</h2>
        <Button variant="outline" asChild className="rounded-xl"><Link href="/">トップへ戻る</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* ナビゲーション */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-xl shadow-sm">
          <Link href="/"><ChevronLeft size={20} /></Link>
        </Button>
        <span className="text-sm font-black uppercase tracking-widest text-slate-400">Back to News</span>
      </div>

      {/* メインビジュアル */}
      {article.mainImageUrl && (
        <div className="aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
          <img src={article.mainImageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* 記事ヘッダー */}
      <div className="space-y-4 px-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter flex items-center gap-2">
            <Tag size={12} /> {article.categoryId || 'General'}
          </span>
          <span className="text-slate-400 text-xs font-bold flex items-center gap-2">
            <Calendar size={12} /> {article.lastSyncedDate ? new Date(article.lastSyncedDate).toLocaleDateString() : 'Date Unknown'}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          {article.title}
        </h1>
      </div>

      {/* 本文エリア */}
      <Card className="rounded-[40px] border-none shadow-2xl bg-white overflow-hidden">
        <CardContent className="p-8 md:p-12">
          <div 
            className="prose prose-slate max-w-none text-lg leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: article.htmlContent || '' }} 
          />
        </CardContent>
      </Card>
    </div>
  );
}