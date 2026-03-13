'use client';

import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where, doc } from 'firebase/firestore';
import { ArticleCard } from '@/components/ArticleCard';
import { Loader2, Calendar, Megaphone, Info } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * 【こちら表示用サイト】
 * 管制（外部ジェミニ）からの指示を受け、ステータス報告と記事の安全な表示を管理します。
 */
export default function Home() {
  const db = useFirestore();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
    }));
  }, []);

  // 公開記事のみを取得
  const allArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading, error: articlesError } = useCollection(allArticlesRef);

  // 管制からのステータス通知を取得
  const siteSettingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'maintenance');
  }, [db]);
  const { data: settings } = useDoc(siteSettingsRef);

  // 広告データの取得
  const adsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'ads');
  }, [db]);
  const { data: ads, isLoading: isAdsLoading } = useCollection(adsRef);

  const latestArticles = useMemo(() => articles?.slice(0, 12) || [], [articles]);
  const activeAd = useMemo(() => ads?.[0] || null, [ads]);

  // インデックスエラー判定
  const isIndexError = articlesError && 'code' in articlesError && articlesError.code === 'failed-precondition';

  return (
    <section className="container mx-auto px-0 pb-20">
      {/* 📡 管制からのステータス報告 (最優先表示) */}
      {settings?.systemNotice && (
        <div className="px-4 md:px-0 mb-8 animate-fade-in">
          <Alert className="bg-primary/10 border-primary rounded-[24px] py-6 px-8 shadow-md ring-2 ring-primary/20">
            <Info className="h-6 w-6 text-primary" />
            <AlertTitle className="text-primary font-black tracking-widest text-xs uppercase mb-2">📡 Message from Control</AlertTitle>
            <AlertDescription className="text-slate-900 font-black text-lg">
              {settings.systemNotice}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* ⚠️ インデックス作成待ち通知 (管制報告がない場合、または併記) */}
      {isIndexError && !settings?.systemNotice && (
        <div className="px-4 md:px-0 mb-8">
          <Alert className="bg-amber-50 border-amber-200 rounded-[24px] py-6 px-8 shadow-sm">
            <Info className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800 font-black tracking-widest text-xs uppercase mb-2">Database Indexing</AlertTitle>
            <AlertDescription className="text-amber-700 font-medium text-sm">
              現在、データベースの索引（インデックス）を作成中です。反映まで数分お待ちください。
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* 広告セクション */}
      <div className="mb-10 md:mb-16 mt-4 md:mt-8 px-4 md:px-0">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone size={12} className="text-slate-400" />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">SPONSORED</span>
        </div>
        
        {isAdsLoading ? (
          <div className="w-full h-20 md:h-32 bg-slate-50 rounded-[16px] md:rounded-[24px] animate-pulse" />
        ) : activeAd ? (
          <Link href={activeAd.linkUrl || '#'} target={activeAd.linkUrl ? "_blank" : "_self"} className="relative block w-full h-20 md:h-32 rounded-[16px] md:rounded-[24px] overflow-hidden group shadow-md border">
            <Image src={activeAd.imageUrl} alt={activeAd.title || "Ad"} fill className="object-cover transition-transform group-hover:scale-105" priority />
          </Link>
        ) : (
          <div className="relative w-full h-20 md:h-32 bg-slate-50 rounded-[16px] md:rounded-[24px] overflow-hidden shadow-inner border flex items-center justify-center">
            <p className="text-[8px] md:text-[10px] font-black tracking-[0.5em] text-slate-300 uppercase">Advertising Space</p>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-slate-100 pb-8 px-4 md:px-0">
        <div className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
          <span className="text-primary">最新</span>の<span className="text-primary">記事</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[8px] md:text-[10px] uppercase tracking-[0.2em] bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-100 w-fit">
          <Calendar size={10} className="text-primary md:size-3" /> <span>{currentTime || '...'}</span>
        </div>
      </div>

      {isArticlesLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary mb-4 size-10" strokeWidth={3} />
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]">Synchronizing Archives</p>
        </div>
      ) : latestArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 animate-fade-in mb-16 px-4 md:px-0">
          {latestArticles.map((article, idx) => (
            <ArticleCard key={article.id} article={article as any} priority={idx < 4} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200 mx-4 md:mx-0">
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">
            {isIndexError ? 'Waiting for database indexing' : 'No articles published yet'}
          </p>
        </div>
      )}
    </section>
  );
}
