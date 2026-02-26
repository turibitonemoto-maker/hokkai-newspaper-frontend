
'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function ArticlePage() {
  const { id } = useParams();
  const db = useFirestore();
  const docRef = id && db ? doc(db, 'articles', id as string) : null;
  const { data: article, isLoading } = useDoc(docRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">記事が見つかりませんでした</h1>
          <Button asChild>
            <Link href="/">トップへ戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  const displayImage = article.imageUrl || `https://picsum.photos/seed/${article.id}/1200/600`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-8 gap-2 -ml-4" asChild>
            <Link href="/"><ChevronLeft size={18} /> 一覧に戻る</Link>
          </Button>

          <header className="mb-10 text-center md:text-left">
            <Badge className="mb-4" variant="secondary">{article.categoryId}</Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground border-b border-slate-200 pb-8">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>公開日: {article.publishDate?.split('T')[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>取材班</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>読了目安: 3分</span>
              </div>
            </div>
          </header>

          <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-primary/10">
            <Image
              src={displayImage}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100">
            {article.summary && (
              <div className="bg-slate-50 border-l-4 border-primary p-6 rounded-r-xl mb-10 italic text-muted-foreground">
                <p className="font-bold text-primary not-italic mb-2 text-sm uppercase tracking-widest">Article Summary</p>
                {article.summary}
              </div>
            )}
            
            <article 
              className="prose prose-slate lg:prose-xl max-w-none prose-headings:font-black prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: article.htmlContent || '' }}
            />
          </div>

          <div className="mt-16 text-center border-t pt-12">
            <p className="text-muted-foreground mb-6">この記事が役に立ったらシェアしてください</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="rounded-full px-8">SNSでシェア</Button>
              <Button variant="default" className="rounded-full px-8" asChild>
                <Link href="/">他の記事を読む</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} 北海学園大学新聞会</p>
        </div>
      </footer>
    </div>
  );
}
