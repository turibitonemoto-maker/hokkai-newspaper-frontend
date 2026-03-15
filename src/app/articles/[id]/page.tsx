
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ChevronLeft, Type, FileText } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * 記事詳細ページ (道新スタイル・PDFビューアー統合版)
 * 日本仕様の行間(leading-6)と段落間余白(my-3)を適用。
 */
export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('base');

  const articleRef = useMemoFirebase(() => {
    if (!id || !db) return null;
    return doc(db, 'articles', id as string);
  }, [db, id]);

  const { data: article, isLoading } = useDoc(articleRef);

  const isPublic = article?.isPublished === true;
  const displayImage = article?.mainImageUrl || "";
  const mainContent = useMemo(() => article?.content || '', [article?.content]);

  // GoogleドライブのPDFリンクを埋め込み用に変換
  const embedPdfUrl = useMemo(() => {
    if (!article?.pdfUrl) return null;
    if (article.pdfUrl.includes('drive.google.com')) {
      return article.pdfUrl.replace(/\/view\?usp=sharing|\/view\?usp=drivesdk/g, '/preview');
    }
    return article.pdfUrl;
  }, [article?.pdfUrl]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-300 tracking-[0.5em] uppercase animate-pulse">Synchronizing Media...</p>
        </div>
      </div>
    );
  }

  if (!article || !isPublic) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Not Found</h1>
          <Button onClick={() => router.push('/')} className="rounded-full px-10 h-12 font-black">TOPに戻る</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Button 
            variant="ghost" 
            className="group gap-2 -ml-4 hover:bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest rounded-full px-6"
            onClick={() => router.back()}
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" /> BACK
          </Button>
          
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border shadow-sm">
            <div className="px-3 text-slate-400"><Type size={14} /></div>
            {(['base', 'lg', 'xl'] as const).map((size) => (
              <Button 
                key={size}
                variant={fontSize === size ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setFontSize(size)}
                className={cn(
                  "rounded-full h-8 px-4 font-black text-[10px] uppercase",
                  fontSize === size ? "bg-white shadow-sm text-primary" : "text-slate-400"
                )}
              >
                {size === 'base' ? '標準' : size === 'lg' ? '大' : '特大'}
              </Button>
            ))}
          </div>
        </div>

        <article className="animate-fade-in">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <Badge className="bg-primary text-white border-none font-black py-1 px-4 text-[10px] tracking-widest uppercase">
                {article.categoryId}
              </Badge>
              <Separator className="flex-grow bg-slate-100" />
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-10 leading-[1.15] text-slate-950">
              {article.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6 py-8 border-y border-slate-100 text-[11px] text-slate-500 font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2.5">
                <Calendar size={14} className="text-primary/60" />
                <span>{article.publishDate?.split('T')[0]}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <User size={14} className="text-primary/60" />
                <span>{article.authorName || '北海学園大学一部新聞会'}</span>
              </div>
            </div>
          </header>

          {/* PDF紙面ビューアー (道新スタイル) */}
          {embedPdfUrl && (
            <div className="mb-16 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                <FileText size={16} /> Paper Edition Viewer
              </div>
              <div className="relative aspect-[1/1.4] w-full rounded-[32px] overflow-hidden border shadow-2xl bg-slate-100 ring-1 ring-slate-200">
                <iframe 
                  src={embedPdfUrl} 
                  className="absolute inset-0 w-full h-full border-none"
                  allow="autoplay"
                />
              </div>
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">※ビューアーが表示されない場合は再読み込みしてください</p>
            </div>
          )}

          {displayImage && !embedPdfUrl && (
            <div className="relative aspect-[16/9] rounded-[32px] md:rounded-[56px] overflow-hidden mb-16 shadow-2xl ring-1 ring-slate-100 bg-slate-50">
              <Image
                src={displayImage}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <div 
              className={cn(
                "prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tighter font-medium",
                "prose-p:leading-6 prose-p:my-3 prose-li:my-1 prose-img:rounded-xl prose-img:shadow-lg",
                fontSize === 'base' && "text-base md:text-lg", 
                fontSize === 'lg' && "text-lg md:text-xl",
                fontSize === 'xl' && "text-xl md:text-2xl" 
              )}
              dangerouslySetInnerHTML={{ __html: mainContent }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
