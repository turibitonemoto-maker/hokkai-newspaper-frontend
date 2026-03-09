
'use client';

import { useSearchParams } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { ArticleCard } from '@/components/ArticleCard';
import { Search, Loader2, Ghost, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryText = searchParams.get('q') || '';
  const db = useFirestore();

  // 検索は一旦全公開記事を取得し、クライアントサイドでフィルタリング（MVP用）
  const allArticlesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading } = useCollection(allArticlesQuery);

  const filteredArticles = useMemo(() => {
    if (!articles || !queryText) return [];
    const lowerQuery = queryText.toLowerCase();
    return articles.filter(article => 
      article.title?.toLowerCase().includes(lowerQuery) || 
      article.htmlContent?.toLowerCase().includes(lowerQuery)
    );
  }, [articles, queryText]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-body">
      <main className="flex-grow container mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 bg-white w-fit px-4 py-2 rounded-full shadow-sm border">
          <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
          <ChevronRight size={12} className="text-slate-200" />
          <span className="text-primary uppercase">Search Results</span>
        </nav>

        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg">
              <Search size={24} />
            </div>
            <div className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
              <span className="text-primary">「{queryText}」</span>
              <span className="text-slate-950">の</span>
              <span className="text-primary">検索</span>
              <span className="text-slate-950">結果</span>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
            キーワードに一致する記事が {filteredArticles.length} 件見つかりました。
          </p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-primary mb-6" size={60} strokeWidth={3} />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Searching Archives</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fade-in">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article as any} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-24 md:p-32 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
              <Ghost className="text-slate-200" size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">一致する記事がありません</h3>
            <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
              別のキーワードで試してみるか、カテゴリーから探してみてください。
            </p>
            <Link href="/" className="inline-block mt-8 text-primary font-bold uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8">
              BACK TO HOME
            </Link>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 text-slate-600 py-16 text-center border-t border-slate-900">
        <div className="container mx-auto px-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
            &copy; {new Date().getFullYear()} 北海学園大学新聞 / REPORTING FOR THE FUTURE
          </p>
        </div>
      </footer>
    </div>
  );
}
