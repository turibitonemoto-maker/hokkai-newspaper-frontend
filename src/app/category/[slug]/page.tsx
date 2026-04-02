'use client';

import { useParams } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { ArticleCard } from '@/components/ArticleCard';
import { PaperCard } from '@/components/PaperCard';
import { ChevronRight, Filter, Loader2, Ghost, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

/**
 * カテゴリ別記事一覧ページ (デネブ・正常化版)
 * 大文字小文字の揺れを許容し、確実に記事を捕捉します。
 */
export default function CategoryPage() {
  const { slug } = useParams();
  const db = useFirestore();

  // 物理的結合の強化: 大文字小文字の揺れに対応するため、公開済み記事を全取得してメモリ上でフィルタリング
  const baseQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: allArticles, isLoading } = useCollection(baseQuery);

  const articles = useMemo(() => {
    if (!allArticles || !slug) return [];
    const targetSlug = (slug as string).toLowerCase();
    return allArticles.filter(a => 
      a.categoryId?.toLowerCase() === targetSlug ||
      (targetSlug === 'viewer' && (a.categoryId === 'Paper' || a.categoryId === 'Viewer'))
    );
  }, [allArticles, slug]);

  const isPaper = slug === 'Paper' || slug === 'Viewer' || (slug as string).toLowerCase() === 'paper' || (slug as string).toLowerCase() === 'viewer';

  const paperGroupedByDate = useMemo(() => {
    if (!articles || !isPaper) return [];
    const grouped: Record<string, any[]> = {};
    articles.forEach(p => {
      const date = p.publishDate?.split('T')[0] || 'Unknown Date';
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(p);
    });
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  }, [articles, isPaper]);

  const categoryDisplayName = useMemo(() => {
    if (isPaper) return '紙面ビューアー';
    return slug as string;
  }, [isPaper, slug]);

  return (
    <div className="container mx-auto px-4 py-12 pb-24">
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 bg-white w-fit px-4 py-2 rounded-full shadow-sm border">
        <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
        <ChevronRight size={12} className="text-slate-200" />
        <span className="text-primary">{categoryDisplayName}</span>
      </nav>

      <header className="mb-16">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/20">
              {isPaper ? <BookOpen size={24} /> : <Filter size={24} />}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic">
              {categoryDisplayName}
            </h1>
          </div>
        </div>
        <p className="text-slate-500 font-medium max-w-2xl leading-relaxed mt-6">
          {isPaper ? '1950年の創立以来の歴史を、当時の紙面そのままに振り返ることができます。' : `${categoryDisplayName}に関するすべての記事一覧です。`}
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="animate-spin text-primary mb-6" size={60} strokeWidth={3} />
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Synchronizing Archives</p>
        </div>
      ) : articles && articles.length > 0 ? (
        isPaper ? (
          <div className="space-y-16 animate-fade-in">
            {paperGroupedByDate.map(([date, papers]) => (
              <div key={date} className="space-y-6">
                <div className="bg-primary px-6 py-2 rounded-sm text-white font-black text-sm tracking-widest flex items-center gap-4">
                   <span>{papers[0]?.title || 'アーカイブ'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
                  {papers.map((paper) => (
                    <PaperCard key={paper.id} article={paper as any} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fade-in">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article as any} />
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-[40px] p-32 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
            <Ghost className="text-slate-200" size={48} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">記事がありません</h3>
          <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">まだこのカテゴリに公開された記事がないようです。</p>
          <Link href="/" className="inline-block mt-8 text-primary font-bold uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8">BACK TO HOME</Link>
        </div>
      )}
    </div>
  );
}
