'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ChevronLeft, Type, ShieldCheck, Layers, Camera, FileText } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * 記事詳細・物理ビューアーページ (PDF/JPEG 統合・デネブ版)
 * 最高司令官の指令により、画像を題名の「上」に配置するよう物理構成を組み替えました。
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
  const paperImages = article?.paperImages || [];
  const mainContent = article?.content || '';

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Archive...</p>
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
          {/* 【指令：見出し画像は題名の上】 */}
          {/* PDF 物理ビューアー */}
          {pdfUrl && (
            <div className="mb-12 space-y-6">
              <div className="relative w-full aspect-[1/1.414] rounded-[32px] overflow-hidden border-8 border-white shadow-2xl bg-slate-50 ring-1 ring-slate-200">
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-none"
                  title={article.title}
                />
              </div>
              <div className="flex justify-center">
                <Button asChild className="rounded-full bg-slate-900 text-white font-black px-10 h-12 shadow-xl hover:scale-[1.05] transition-transform">
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">全画面で表示する</a>
                </Button>
              </div>
            </div>
          )}

          {/* JPEG 物理ビューアー */}
          {paperImages.length > 0 && !pdfUrl && (
            <div className="mb-12 space-y-12">
              <div className="space-y-16">
                {paperImages.map((imgUrl: string, index: number) => (
                  <div key={index} className="relative aspect-[1/1.414] w-full rounded-[16px] overflow-hidden border-8 border-white shadow-2xl bg-slate-50 ring-1 ring-slate-200">
                    <Image
                      src={imgUrl}
                      alt={`${article.title} - Page ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 896px"
                      priority={index === 0}
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/60 text-white text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-sm">
                      PAGE {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* メイン画像（紙面がない場合） */}
          {article.mainImageUrl && !pdfUrl && paperImages.length === 0 && (
            <figure className="mb-12 space-y-5">
              <div className="relative aspect-[16/9] rounded-[48px] overflow-hidden shadow-2xl ring-8 ring-white bg-slate-50">
                <Image
                  src={article.mainImageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
              {article.mainImageCaption && (
                <figcaption className="flex items-start gap-3 px-8 py-2 text-slate-500 italic border-l-4 border-primary/20">
                  <Camera size={16} className="shrink-0 mt-1 text-primary/40" />
                  <span className="text-sm md:text-base leading-relaxed font-medium tracking-wide">
                    {article.mainImageCaption}
                  </span>
                </figcaption>
              )}
            </figure>
          )}

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <Badge className="bg-primary text-white border-none font-black py-1 px-4 text-[10px] tracking-widest uppercase shadow-md rounded-full">
                {article.categoryId}
              </Badge>
              {article.issueNumber && (
                <Badge variant="outline" className="border-primary text-primary font-black py-1 px-4 text-[10px] tracking-widest uppercase rounded-full">
                  {article.issueNumber}
                </Badge>
              )}
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
                <span>{article.authorName || '北海学園大学新聞'}</span>
              </div>
            </div>
          </header>

          <div className="max-w-3xl mx-auto">
            <div 
              className={cn(
                "prose prose-slate max-w-none font-medium text-slate-800 tracking-wide",
                "prose-p:leading-6 prose-p:my-3",
                "prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-tight prose-h2:mb-6 prose-h2:mt-12",
                "prose-img:rounded-[32px] prose-img:shadow-xl prose-img:ring-8 prose-img:ring-white prose-img:my-12",
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
