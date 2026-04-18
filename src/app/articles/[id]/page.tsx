
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ChevronLeft, Type, Camera } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn, getDisplayImageUrl } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

/**
 * 記事詳細・物理ビューアーページ (管理サイト連動・極限最適化版)
 */
export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const articleRef = useMemoFirebase(() => {
    if (!id || !db) return null;
    return doc(db, 'articles', id as string);
  }, [db, id]);

  const { data: article, isLoading } = useDoc(articleRef);

  const isPublic = article?.isPublished === true;
  const pdfUrl = article?.pdfUrl;
  const paperImages = useMemo(() => (article?.paperImages || []).map((url: string) => getDisplayImageUrl(url)), [article?.paperImages]);
  const mainImageUrl = useMemo(() => getDisplayImageUrl(article?.mainImageUrl), [article?.mainImageUrl]);
  
  // 【最重要：管理サイトの新フィールド mainImageCaption を最優先で結合】
  const mainImageCaption = article?.mainImageCaption || article?.caption || article?.imageCaption || "";
  
  const mainContent = article?.content || '';

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronizing Archive...</p>
      </div>
    );
  }

  if (!article || !isPublic) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white text-center">
        <h1 className="text-3xl font-black mb-6 tracking-tighter text-slate-900 uppercase italic">Not Found</h1>
        <Button onClick={() => router.push('/')} className="rounded-full px-10 font-black tracking-widest bg-primary text-white shadow-lg">TOPに戻る</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-16 lg:px-24 py-10 md:py-16 pb-40">
      <div className="max-w-4xl mx-auto">
        {/* 操作バー */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <Button 
            variant="ghost" 
            className="group gap-1 md:gap-2 -ml-2 md:-ml-4 hover:bg-slate-50 text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest rounded-full px-4 md:px-6"
            onClick={() => router.back()}
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" /> BACK
          </Button>
          
          <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-full border shadow-sm">
            <div className="px-2 text-slate-400"><Type size={12} /></div>
            {(['base', 'lg', 'xl'] as const).map((size) => (
              <Button 
                key={size}
                variant={fontSize === size ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setFontSize(size)}
                className={cn(
                  "rounded-full h-7 md:h-9 px-3 md:px-5 font-black text-[9px] md:text-[10px] uppercase",
                  fontSize === size ? "bg-white shadow-sm text-primary" : "text-slate-400"
                )}
              >
                {size === 'base' ? '標' : size === 'lg' ? '大' : '特'}
              </Button>
            ))}
          </div>
        </div>

        <article className="animate-fade-in">
          {/* 【報道ブロック：ビジュアルとキャプションを物理的に一つのコンテナに密着固定】 */}
          <div className="mb-12 md:mb-20">
            <div className="shadow-2xl rounded-[16px] md:rounded-[48px] overflow-hidden bg-slate-50 ring-1 ring-slate-200">
              <div className="relative w-full">
                {pdfUrl ? (
                  <div className="relative w-full aspect-[1/1.414]">
                    <iframe
                      src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full border-none"
                      title={article.title}
                    />
                  </div>
                ) : paperImages.length > 0 ? (
                  <div className="relative aspect-[1/1.414] w-full">
                    <Image
                      src={paperImages[0]}
                      alt={`${article.title} - Cover`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 896px"
                      priority
                      unoptimized={paperImages[0].includes('drive.google.com')}
                    />
                  </div>
                ) : mainImageUrl ? (
                  <div className="relative aspect-[16/10] md:aspect-[16/9] w-full">
                    <Image
                      src={mainImageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 896px"
                      className="object-cover"
                      unoptimized={mainImageUrl.includes('drive.google.com')}
                    />
                  </div>
                ) : null}
              </div>

              {/* 【物理密着：コンテナ内部でキャプションを描画することで場所の間違いを阻止】 */}
              {mainImageCaption && (
                <div className="flex items-start gap-4 md:gap-6 px-6 md:px-10 py-8 md:py-12 text-slate-800 italic border-t-8 border-primary bg-white">
                  <Camera size={32} className="shrink-0 mt-1 text-primary" />
                  <span className="text-xl md:text-3xl leading-snug font-black tracking-tight">
                    {mainImageCaption}
                  </span>
                </div>
              )}
            </div>

            {/* 紙面アーカイブの2ページ目以降 */}
            {!pdfUrl && paperImages.length > 1 && (
              <div className="mt-12 md:mt-24 space-y-12 md:space-y-24">
                {paperImages.slice(1).map((imgUrl: string, index: number) => (
                  <div key={index} className="relative aspect-[1/1.414] w-full rounded-[12px] md:rounded-[32px] overflow-hidden border-2 md:border-[16px] border-white shadow-2xl bg-slate-50 ring-1 ring-slate-200">
                    <Image
                      src={imgUrl}
                      alt={`${article.title} - Page ${index + 2}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 896px"
                      unoptimized={imgUrl.includes('drive.google.com')}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {pdfUrl && (
              <div className="flex justify-center mt-8">
                <Button asChild className="rounded-full bg-slate-900 text-white font-black px-10 md:px-16 h-12 md:h-14 text-sm shadow-2xl hover:scale-[1.05] transition-transform">
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">全画面表示で読む</a>
                </Button>
              </div>
            )}
          </div>

          <header className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
              <Link href={`/category/${article.categoryId}`}>
                <Badge className="bg-primary text-white border-none font-black py-1.5 px-4 md:px-6 text-[10px] md:text-xs tracking-widest uppercase shadow-xl rounded-full hover:scale-105 transition-transform">
                  {article.categoryId}
                </Badge>
              </Link>
              {article.issueNumber && (
                <Badge variant="outline" className="border-primary text-primary font-black py-1.5 px-4 md:px-6 text-[10px] md:text-xs tracking-widest uppercase rounded-full">
                  {article.issueNumber}
                </Badge>
              )}
              <Separator className="flex-grow bg-slate-100" />
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-8 md:mb-12 leading-[1.1] text-slate-950">
              {article.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 py-6 md:py-8 border-y border-slate-100 text-[11px] md:text-xs text-slate-500 font-black uppercase tracking-[0.3em]">
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-primary/60" />
                <span>{article.publishDate?.split('T')[0]}</span>
              </div>
              <div className="flex items-center gap-3">
                <User size={14} className="text-primary/60" />
                <span>{article.authorName || '北海学園大学新聞会'}</span>
              </div>
            </div>
          </header>

          <div className="max-w-3xl mx-auto">
            <div 
              className={cn(
                "prose prose-slate max-w-none font-medium text-slate-800 tracking-wide",
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
