'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ChevronLeft, Type, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * 記事詳細ページ (最終・鉄壁シールド・黄金比版)
 * 
 * 1. 物理ボタン上書き: Googleのボタン位置に「本物の自前ボタン」を配置。クリックを奪い取り、独自にポップアップ。
 * 2. コピーガード: select-none により記事のコピペを封印。
 * 3. 視認性100%: 「ずらし」を廃止し、本来の正しい位置で紙面を表示。
 * 4. 黄金比密度: leading-6 (行間) と my-3 (段落余白) を厳格適用。
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

  const standardPdfUrl = useMemo(() => {
    if (!article?.pdfUrl) return null;
    let url = article.pdfUrl;
    if (url.includes('/view') || url.includes('/edit') || url.includes('/share')) {
      return url.replace(/\/(view|edit|share|usp=drivesdk).*/g, '/preview');
    }
    return url;
  }, [article?.pdfUrl]);

  const handleOpenExternal = () => {
    if (standardPdfUrl) {
      window.open(standardPdfUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article || !isPublic) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white text-center">
        <h1 className="text-3xl font-black mb-6 tracking-tighter text-slate-900">記事が見つかりません</h1>
        <Button onClick={() => router.push('/')} className="rounded-full px-10 font-black tracking-widest bg-primary text-white">TOPに戻る</Button>
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
              <Badge className="bg-primary text-white border-none font-black py-1 px-4 text-[10px] tracking-widest uppercase shadow-sm">
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

          {/* 紙面ビューアー (物理シールド版) */}
          {standardPdfUrl && (
            <div className="mb-16 space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                  <FileText size={16} /> Paper Edition Archive
                </div>
              </div>
              
              <div className="relative aspect-[1/1.414] w-full rounded-[32px] overflow-hidden border-8 border-white shadow-2xl bg-slate-100 ring-1 ring-slate-200">
                {/* 物理ボタン: Googleのボタンを完全に覆い、クリックを奪い取る */}
                <div className="absolute top-2 right-2 z-50">
                  <Button 
                    onClick={handleOpenExternal}
                    className="bg-primary text-white p-2.5 h-auto rounded-2xl shadow-xl flex items-center gap-2 border-2 border-white/20 hover:scale-105 transition-transform"
                  >
                    <ExternalLink size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">紙面を拡大表示</span>
                  </Button>
                </div>

                <iframe 
                  src={standardPdfUrl} 
                  className="absolute inset-0 w-full h-full border-none"
                  allow="autoplay"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
              
              <p className="text-[9px] text-center text-slate-400 font-black uppercase tracking-[0.3em] py-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-2">
                <ShieldCheck size={12} className="text-primary" /> 本紙面は公式アーカイブにより保護されています
              </p>
            </div>
          )}

          {displayImage && !standardPdfUrl && (
            <div className="relative aspect-[16/9] rounded-[48px] overflow-hidden mb-16 shadow-2xl ring-8 ring-white bg-slate-50">
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

          <div className="max-w-3xl mx-auto select-none">
            <div 
              className={cn(
                "prose prose-slate max-w-none font-medium text-slate-800",
                "prose-p:leading-6 prose-p:my-3 prose-li:my-1",
                "prose-img:rounded-[32px] prose-img:shadow-xl prose-img:ring-8 prose-img:ring-white",
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
