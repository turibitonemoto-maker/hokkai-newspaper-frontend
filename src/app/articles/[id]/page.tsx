'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ChevronLeft, Type, FileText, ShieldCheck, Lock } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * 記事詳細ページ (最終ステルス・シールド版)
 * GoogleドライブのUI（ヘッダー/ポップアウト）を物理的に画面外へ追い出し、
 * 透明なシールドレイヤーでクリックを完全に絶縁。
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

  // 【物理的ステルス変換】GoogleドライブのURLをUI排除版(preview)に強制変換し、余計なパラメータを排除
  const stealthPdfUrl = useMemo(() => {
    if (!article?.pdfUrl) return null;
    let url = article.pdfUrl;
    // /view, /edit, /share などを全て /preview に置換し、さらに余計なパスを削ぎ落とす
    url = url.replace(/\/(view|edit|share|usp=drivesdk).*/g, '/preview');
    return url;
  }, [article?.pdfUrl]);

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
        <h1 className="text-3xl font-black mb-6 tracking-tighter">Article Not Found</h1>
        <Button onClick={() => router.push('/')} className="rounded-full px-10 font-black tracking-widest">TOPに戻る</Button>
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

          {/* 物理封印ステルス・シールド・PDFビューアー */}
          {stealthPdfUrl && (
            <div className="mb-16 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                  <FileText size={16} /> Paper Edition Viewer
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm animate-pulse">
                  <ShieldCheck size={12} /> Official Protection Enabled
                </div>
              </div>
              
              <div className="relative aspect-[1/1.414] w-full rounded-[40px] overflow-hidden border-8 border-white shadow-2xl bg-slate-100 ring-1 ring-slate-200 group">
                {/* 物理的シールド：Googleのヘッダー（ポップアウトボタン含む）を画面外（上部）へ強制的に追い出す */}
                <iframe 
                  src={stealthPdfUrl} 
                  className="absolute w-full h-[calc(100%+64px)] -top-[64px] border-none"
                  allow="autoplay"
                  sandbox="allow-scripts allow-same-origin"
                />
                
                {/* ゴースト・レイヤー (Ghost Layer): 右上のボタン位置に広範囲のクリック絶縁地帯を配置 */}
                <div className="absolute top-0 right-0 w-[120px] h-[80px] bg-transparent z-50 cursor-default" />
                
                {/* 下部も誤操作防止（Googleのツールバー等） */}
                <div className="absolute bottom-0 left-0 w-full h-12 bg-transparent z-50 cursor-default" />
                
                {/* 境界保護レイヤー（オーバーレイ） */}
                <div className="absolute inset-0 pointer-events-none ring-inset ring-[1px] ring-black/5 rounded-[32px]" />
                
                {/* ウォーターマーク演出 */}
                <div className="absolute bottom-4 right-8 flex items-center gap-2 opacity-20 pointer-events-none select-none">
                  <Lock size={12} />
                  <span className="text-[10px] font-black tracking-widest uppercase">HGU NEWS OFFICIAL</span>
                </div>
              </div>
              
              <p className="text-[9px] text-center text-slate-400 font-black uppercase tracking-[0.3em] py-4 bg-slate-50 rounded-2xl">
                ※公式ビューアーで安全に閲覧中。無断転載・複製を禁じます。
              </p>
            </div>
          )}

          {displayImage && !stealthPdfUrl && (
            <div className="relative aspect-[16/9] rounded-[48px] overflow-hidden mb-16 shadow-2xl ring-8 ring-white bg-slate-50">
              <Image
                src={displayImage}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
          )}

          <div className="max-w-3xl mx-auto">
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
