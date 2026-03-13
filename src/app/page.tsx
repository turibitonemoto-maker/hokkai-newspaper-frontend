'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { ArticleCard } from '@/components/ArticleCard';
import { Loader2, Calendar, Megaphone, ChevronRight, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { fetchAndSyncNoteRss } from '@/app/actions/sync-note';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
    }));
  }, []);

  const adminEmails = ["r06hgunews@gmail.com", "turibitonemoto@gmail.com"];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  // 記事データの取得
  const allArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading } = useCollection(allArticlesRef);

  // 広告データの取得
  const adsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'ads');
  }, [db]);

  const { data: ads, isLoading: isAdsLoading } = useCollection(adsRef);

  const latestArticles = useMemo(() => articles?.slice(0, 12) || [], [articles]);
  const activeAd = useMemo(() => ads?.[0] || null, [ads]);
  const adPlaceholder = useMemo(() => PlaceHolderImages.find(img => img.id === 'ad-placeholder'), []);

  // note同期処理
  const handleSyncNote = async () => {
    if (!isAdmin || isSyncing) return;
    setIsSyncing(true);
    
    toast({
      title: "同期を開始します",
      description: "note.com から最新の記事を取得しています...",
    });

    try {
      const result = await fetchAndSyncNoteRss();
      if (result.success && result.articles) {
        if (result.articles.length === 0) {
          toast({
            title: "同期完了",
            description: "新しい記事はありませんでした。",
          });
          return;
        }

        let count = 0;
        for (const article of result.articles) {
          const articleRef = doc(db, 'articles', article.id);
          // 各記事を Firestore に保存
          setDocumentNonBlocking(articleRef, article);
          count++;
        }
        toast({
          title: "同期成功",
          description: `${count}件のnote記事を反映しました。一覧の更新をお待ちください。`,
        });
      } else {
        throw new Error(result.error || '同期処理中にエラーが発生しました。');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "同期失敗",
        description: error.message,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <section className="container mx-auto px-0 pb-20">
      {/* 管理者用同期パネル */}
      {isAdmin && (
        <div className="mb-8 px-4 md:px-0">
          <div className="bg-slate-900 text-white rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-white/10">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-2xl">
                <RefreshCw size={24} className={isSyncing ? "animate-spin text-primary" : "text-primary"} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-1">Administrator Sync Panel</p>
                <p className="text-sm font-bold text-slate-300">公式 note.com の最新記事をデータベースに同期します。</p>
              </div>
            </div>
            <Button 
              onClick={handleSyncNote} 
              disabled={isSyncing}
              className="bg-white text-slate-900 hover:bg-primary hover:text-white rounded-full px-10 font-black text-xs uppercase tracking-widest h-14 w-full md:w-auto transition-all shadow-xl"
            >
              {isSyncing ? (
                <span className="flex items-center gap-2"><Loader2 className="animate-spin size-4" /> Syncing...</span>
              ) : (
                "Sync with note"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* 広告セクション */}
      <div className="mb-10 md:mb-16 mt-4 md:mt-8 px-4 md:px-0">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone size={12} className="text-slate-400" />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">SPONSORED / 広告</span>
        </div>
        
        {isAdsLoading ? (
          <div className="w-full h-20 md:h-32 bg-slate-50 rounded-[16px] md:rounded-[24px] animate-pulse" />
        ) : activeAd ? (
          <Link 
            href={activeAd.linkUrl || '#'} 
            target={activeAd.linkUrl ? "_blank" : "_self"}
            className="relative block w-full h-20 md:h-32 bg-slate-50 rounded-[16px] md:rounded-[24px] overflow-hidden group shadow-md border border-slate-100"
          >
            <Image 
              src={activeAd.imageUrl} 
              alt={activeAd.title || "Advertisement"} 
              fill 
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {activeAd.title && (
              <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {activeAd.title}
              </div>
            )}
          </Link>
        ) : (
          <Link 
            href="/ads"
            className="relative block w-full h-20 md:h-32 bg-slate-50 rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer shadow-inner border border-slate-100"
          >
            {adPlaceholder && (
              <Image 
                src={adPlaceholder.imageUrl} 
                alt="Advertisement" 
                fill 
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                priority
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-transparent transition-all">
              <div className="bg-white/90 backdrop-blur-sm px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-xl border">
                <p className="text-[8px] md:text-[10px] font-black tracking-widest text-slate-900 uppercase">広告募集中</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-10 border-b border-slate-100 pb-6 md:pb-8 px-4 md:px-0">
        <div>
          <div className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
            <span className="text-primary">最新</span>
            <span className="text-slate-950">の</span>
            <span className="text-primary">記事</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[8px] md:text-[10px] uppercase tracking-[0.2em] bg-slate-50 px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-slate-100 w-fit">
          <Calendar size={10} className="text-primary md:size-3" /> <span>{currentTime || '...'}</span>
        </div>
      </div>

      {isArticlesLoading ? (
        <div className="flex flex-col items-center justify-center py-20 md:py-24">
          <Loader2 className="animate-spin text-primary mb-4 size-10 md:size-12" strokeWidth={3} />
          <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Synchronizing Feed</p>
        </div>
      ) : latestArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 animate-fade-in mb-16 px-4 md:px-0">
          {latestArticles.map((article, idx) => (
            <ArticleCard key={article.id} article={article as any} priority={idx < 4} />
          ))}
        </div>
      ) : (
        <div className="py-20 md:py-24 text-center bg-white rounded-[24px] md:rounded-[32px] border border-dashed border-slate-200 mx-4 md:mx-0">
          <p className="text-slate-400 font-bold uppercase text-[8px] md:text-[10px] tracking-[0.3em]">No stories found in the archives</p>
        </div>
      )}

      {articles && articles.length > 12 && (
        <div className="mb-20 px-4 md:px-0 text-center md:text-left">
          <Link 
            href="/category/Campus" 
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-slate-900 text-white rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            View More Stories <ChevronRight className="size-3 md:size-[14px]" />
          </Link>
        </div>
      )}
    </section>
  );
}
