'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { PaperCard } from '@/components/PaperCard';
import { Loader2, Ghost, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';

/**
 * 紙面ビューアー・物理直結ページ (デネブ版)
 * インデックス不足による「表示されない」問題を回避するため、
 * シンプルなクエリで全取得し、メモリ上でフィルタリングを行う「物理的・確実表示」仕様。
 */
export default function ViewerPage() {
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // インデックスが必要な複雑なクエリを避け、publishDateのソートのみを行う
  const baseQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: allArticles, isLoading } = useCollection(baseQuery);

  // 公開済み、かつ Category が 'Paper' または 'Viewer' のものをメモリ上でフィルタリング
  const papers = useMemo(() => {
    if (!allArticles) return [];
    return allArticles.filter(a => 
      (a.categoryId === 'Paper' || a.categoryId === 'Viewer') && 
      a.isPublished === true
    );
  }, [allArticles]);

  const paperGroupedByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    papers.forEach(p => {
      const date = p.publishDate?.split('T')[0] || 'Unknown Date';
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(p);
    });
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  }, [papers]);

  if (!isMounted) return null;

  return (
    <div className="container mx-auto px-4 py-12 pb-24">
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 bg-white w-fit px-4 py-2 rounded-full shadow-sm border">
        <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
        <ChevronRight size={12} className="text-slate-200" />
        <span className="text-primary uppercase tracking-widest font-black">Archive Viewer</span>
      </nav>

      <header className="mb-16">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/20">
              <BookOpen size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic">
              紙面ビューアー
            </h1>
          </div>
          <div className="text-right">
             <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Digital Archive</span>
             <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-primary">Cloud Optimized</span>
          </div>
        </div>
        <p className="text-slate-500 font-medium max-w-2xl leading-6 my-6">
          Cloudinary にホストされた高解像度の紙面 JPEG データが、ここにリアルタイムで反映されます。
          1950年の創立以来の歴史を、当時の質感そのままに振り返ることができます。
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="animate-spin text-primary mb-6" size={60} strokeWidth={3} />
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Fetching Archives from Firestore</p>
        </div>
      ) : papers.length > 0 ? (
        <div className="space-y-16 animate-fade-in">
          {paperGroupedByDate.map(([date, papersList]) => (
            <div key={date} className="space-y-6">
              <div className="bg-primary px-6 py-2 rounded-sm text-white font-black text-sm tracking-widest flex items-center gap-4 shadow-lg shadow-primary/10">
                <span>{date.replace(/-/g, '/')}</span>
                <span className="opacity-50 text-[10px] font-black uppercase tracking-widest">Published</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
                {papersList.map((paper) => (
                  <PaperCard key={paper.id} article={paper as any} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-32 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
            <Ghost className="text-slate-200" size={48} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">アーカイブ未登録</h3>
          <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
            管理サイトから Cloudinary 経由で紙面をアップロードしてください。
          </p>
          <Link href="/" className="inline-block mt-8 text-primary font-bold uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8">BACK TO HOME</Link>
        </div>
      )}
    </div>
  );
}
