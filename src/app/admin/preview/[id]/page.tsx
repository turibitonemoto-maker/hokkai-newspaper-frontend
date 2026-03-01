'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ChevronLeft, Eye } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function ArticlePreviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();

  const articleRef = useMemoFirebase(() => {
    if (!id || !db) return null;
    return doc(db, 'articles', id as string);
  }, [db, id]);

  const { data: article, isLoading } = useDoc(articleRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Generating Preview...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
        <h1 className="text-2xl font-black mb-6">記事が見つかりません</h1>
        <Button onClick={() => window.close()} className="rounded-full">閉じる</Button>
      </div>
    );
  }

  const displayImage = article.mainImageUrl || `https://picsum.photos/seed/${article.id}/1200/600`;

  return (
    <div className="min-h-screen bg-white font-body">
      {/* プレビューバー */}
      <div className="sticky top-0 z-50 w-full bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg">
            <Eye size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Administrator Preview Mode</span>
          {!article.isPublished && (
            <Badge variant="destructive" className="ml-4 font-black text-[9px]">DRAFT / UNPUBLISHED</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => window.close()} className="text-white hover:bg-white/10 font-black text-[10px]">
          プレビューを閉じる
        </Button>
      </div>

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <article>
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-primary text-white border-none font-bold py-1 px-3">
                  {article.categoryId}
                </Badge>
                <div className="h-px flex-grow bg-slate-100" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-[1.1] text-slate-950">
                {article.title}
              </h1>
              
              <div className="flex items-center gap-8 py-8 border-y border-slate-100 text-xs text-slate-500 font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  <span>{article.publishDate?.split('T')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  <span>{article.authorName || '北海学園大学新聞'}</span>
                </div>
              </div>
            </header>

            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-16 shadow-2xl shadow-slate-200 ring-1 ring-slate-100">
              <Image
                src={displayImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="max-w-3xl mx-auto">
              <div 
                className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-800 transition-all duration-300"
                dangerouslySetInnerHTML={{ __html: article.htmlContent || '' }}
              />
            </div>
          </article>
        </div>
      </main>

      <footer className="bg-slate-50 py-12 border-t text-center">
        <p className="text-[10px] text-slate-400 font-black tracking-[0.3em] uppercase">
          &copy; {new Date().getFullYear()} 北海学園大学新聞 PREVIEW MODE
        </p>
      </footer>
    </div>
  );
}