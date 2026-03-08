
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Newspaper, Loader2, Calendar, Ghost, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const db = useFirestore();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
    }));
  }, []);

  // 認証に依存せず、常に最新の記事を取得
  // インデックスエラー（権限不足と誤報される場合がある）を避けるため、クエリを極力シンプル化
  const latestArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading, error } = useCollection(latestArticlesRef);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Navbar />
      
      <main className="flex-grow">
        <section className="relative h-[40vh] md:h-[60vh] flex items-center overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 to-primary/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                <Newspaper size={14} /> <span>Hokkai Gakuen University Newspaper</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
                キャンパスの<span className="text-primary italic">「いま」</span>を届ける。
              </h1>
              <p className="text-lg text-slate-300 max-w-xl font-medium">学生の視点で記録する。学内のニュース、インタビュー、イベント情報をどこよりも深く。</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12 border-b pb-6">
              <h2 className="text-3xl font-black tracking-tight italic uppercase">最新の記事</h2>
              <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <Calendar size={14} className="text-primary" /> <span>{currentTime || '...'}</span>
              </div>
            </div>

            {error ? (
              <div className="py-20 text-center bg-white rounded-[40px] shadow-sm border border-destructive/20">
                <AlertCircle className="mx-auto text-destructive mb-4" size={40} />
                <p className="text-slate-600 font-bold">記事の読み込みに失敗しました。</p>
                <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-black">Public Access Mode: {error.message}</p>
              </div>
            ) : isArticlesLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={48} strokeWidth={3} />
                <p className="mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Fetching Latest Stories...</p>
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-fade-in">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-[40px] shadow-sm">
                <Ghost className="mx-auto text-slate-200 mb-4" size={40} />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">記事がまだありません</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-600 py-12 text-center text-[10px] font-black uppercase tracking-[0.3em] border-t border-slate-900">
        &copy; {new Date().getFullYear()} 北海学園大学新聞 / REPORTING FOR THE FUTURE
      </footer>
    </div>
  );
}
