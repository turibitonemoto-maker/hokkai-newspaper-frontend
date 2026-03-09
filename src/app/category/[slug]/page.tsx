'use client';

import { useParams } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { ChevronRight, Filter, Loader2, Ghost } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage() {
  const { slug } = useParams();
  const db = useFirestore();

  const categoryQuery = useMemoFirebase(() => {
    if (!db || !slug) return null;
    return query(
      collection(db, 'articles'),
      where('categoryId', '==', slug),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
  }, [db, slug]);

  const { data: articles, isLoading } = useCollection(categoryQuery);

  return (
    <div className="min-h-screen flex flex-col bg-white font-body">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 bg-white w-fit px-4 py-2 rounded-full shadow-sm border">
          <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
          <ChevronRight size={12} className="text-slate-200" />
          <span className="text-primary">{slug}</span>
        </nav>

        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/20">
              <Filter size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic">
              {slug}
            </h1>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
            {slug}に関するすべての記事一覧です。北海学園大学の「いま」を現場からお届けします。
          </p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-primary mb-6" size={60} strokeWidth={3} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Database Synchronizing</p>
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fade-in">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article as any} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-32 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
              <Ghost className="text-slate-200" size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">記事がありません</h3>
            <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
              このカテゴリーにはまだ公開された記事がないようです。
            </p>
            <Link href="/" className="inline-block mt-8 text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8">
              BACK TO HOME
            </Link>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 text-slate-500 py-16 border-t border-slate-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-30">
            &copy; {new Date().getFullYear()} 北海学園大学新聞 / REPORTING FOR THE FUTURE
          </p>
        </div>
      </footer>
    </div>
  );
}
