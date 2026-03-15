'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { PaperCard } from '@/components/PaperCard';
import { Loader2, Ghost, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';

/**
 * 紙面ビューアー専用ページ (/viewer)
 * 道新リスペクトの「日付別・縦長サムネイル」グリッドレイアウト。
 * 管理サイトから届く「第〇号」という号数情報を活用。
 */
export default function ViewerPage() {
  const db = useFirestore();

  const paperQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('categoryId', '==', 'Paper'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: papers, isLoading } = useCollection(paperQuery);

  const paperGroupedByDate = useMemo(() => {
    if (!papers) return [];
    const grouped: Record<string, any[]> = {};
    papers.forEach(p => {
      const date = p.publishDate?.split('T')[0] || 'Unknown Date';
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(p);
    });
    // 日付の降順でソート
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  }, [papers]);

  return (
    <div className="container mx-auto px-4 py-12 pb-24">
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 bg-white w-fit px-4 py-2 rounded-full shadow-sm border">
        <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
        <ChevronRight size={12} className="text-slate-200" />
        <span className="text-primary">紙面ビューアー</span>
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
          <div className="flex gap-2 text-xs font-bold text-slate-400">
             <span>Digital Archive / Ichibu Newspaper</span>
          </div>
        </div>
        <p className="text-slate-500 font-medium max-w-2xl leading-relaxed mt-6">
          1950年の創立以来、記者が紡いできた北海学園の歴史を、当時の紙面そのままに振り返ることができます。
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="animate-spin text-primary mb-6" size={60} strokeWidth={3} />
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Synchronizing Archives</p>
        </div>
      ) : papers && papers.length > 0 ? (
        <div className="space-y-16 animate-fade-in">
          {paperGroupedByDate.map(([date, papersList]) => (
            <div key={date} className="space-y-6">
              <div className="bg-primary px-6 py-2 rounded-sm text-white font-black text-sm tracking-widest flex items-center gap-4">
                <span>{date.replace(/-/g, '/')}</span>
                <span className="opacity-50 text-[10px]">発行分</span>
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
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">紙面がありません</h3>
          <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">管理サイトからPDF紙面をアップロードしてください。</p>
          <Link href="/" className="inline-block mt-8 text-primary font-bold uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8">BACK TO HOME</Link>
        </div>
      )}
    </div>
  );
}
