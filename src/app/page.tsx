
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Newspaper, Loader2, Calendar, ChevronRight, Hash } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * 権限概念を完全に排除したトップページ。
 * 最新記事セクションの下に、カテゴリー別のセクションを配置。
 */
export default function Home() {
  const db = useFirestore();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
    }));
  }, []);

  // 全記事を取得（最新順）
  const allArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading } = useCollection(allArticlesRef);

  // カテゴリーリスト
  const categories = [
    { id: 'Announcements', label: 'お知らせ', description: '大学からの公式な通知' },
    { id: 'Campus', label: 'キャンパス', description: '学内の日常とニュース' },
    { id: 'Event', label: 'イベント', description: '行事・企画のレポート' },
    { id: 'Interview', label: 'インタビュー', description: '学生・教職員の声' },
    { id: 'Sports', label: 'スポーツ', description: '部活動・大会の結果' },
    { id: 'Opinion', label: 'オピニオン', description: '学生による論説' },
  ];

  // 最新記事（上位3件）
  const latestArticles = articles?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Navbar />
      
      <main className="flex-grow">
        {/* ヒーローセクション */}
        <section className="relative h-[50vh] md:h-[70vh] flex items-center overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 to-primary/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20 backdrop-blur-md">
                <Newspaper size={14} /> <span>Hokkai Gakuen University Newspaper</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] italic">
                キャンパスの<br />
                <span className="text-primary not-italic">「いま」</span>を届ける。
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-xl font-medium leading-relaxed">
                学生の視点で記録する。学内のニュース、インタビュー、イベント情報をどこよりも深く。
              </p>
            </div>
          </div>
        </section>

        {/* 最新の記事セクション */}
        <section className="py-24 border-b border-slate-200">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-slate-900">最新の記事</h2>
                <div className="h-2 w-20 bg-primary mt-4 rounded-full" />
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-[0.2em] bg-white px-6 py-3 rounded-2xl shadow-sm border">
                <Calendar size={14} className="text-primary" /> <span>{currentTime || '...'}</span>
              </div>
            </div>

            {isArticlesLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary mb-4" size={48} strokeWidth={3} />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Loading Feed...</p>
              </div>
            ) : latestArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-fade-in">
                {latestArticles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-[40px] shadow-sm border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No stories found</p>
              </div>
            )}
          </div>
        </section>

        {/* カテゴリー別セクション */}
        <section className="py-24 bg-slate-100/50">
          <div className="container mx-auto px-4 space-y-32">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Categories</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 italic">新聞記事の分類</h2>
              <p className="text-slate-500 font-medium">各分野の最新ニュースをご覧いただけます。</p>
            </div>

            {categories.map((cat) => {
              const catArticles = articles?.filter(a => a.categoryId === cat.id).slice(0, 3) || [];
              
              return (
                <div key={cat.id} className="space-y-12">
                  <div className="flex items-end justify-between border-b-2 border-slate-200 pb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-primary border-2 border-primary/10">
                        <Hash size={32} />
                      </div>
                      <div>
                        <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">{cat.label}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{cat.description}</p>
                      </div>
                    </div>
                    <Link 
                      href={`/category/${cat.id}`}
                      className="group flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform"
                    >
                      VIEW ALL <ChevronRight size={16} className="bg-primary text-white rounded-lg p-0.5" />
                    </Link>
                  </div>

                  {catArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      {catArticles.map((article) => (
                        <ArticleCard key={article.id} article={article as any} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center bg-white/50 rounded-[32px] border border-dashed border-slate-300">
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">このカテゴリーの記事は準備中です</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-600 py-16 text-center border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8 opacity-50">
            <Newspaper size={24} className="text-primary" />
            <span className="font-black text-xl tracking-tighter text-white">
              北海学園大学<span className="text-primary">新聞</span>
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} 北海学園大学新聞 / REPORTING FOR THE FUTURE
          </p>
        </div>
      </footer>
    </div>
  );
}
