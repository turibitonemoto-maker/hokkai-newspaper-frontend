
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Newspaper, ArrowRight, Loader2, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const db = useFirestore();

  // 公開済みの最新記事6件を取得
  const latestArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc'),
      limit(6)
    );
  }, [db]);

  const { data: articles, isLoading } = useCollection(latestArticlesRef);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 lg:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-widest mb-6 border border-primary/30">
                <Newspaper size={14} />
                <span>HGU Newspaper Club Official</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
                北海学園大学の<br />
                「いま」を記録する。
              </h1>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
                学生の視点で、キャンパスの鼓動を伝える。
                学内ニュース、イベント、独占インタビューをいち早く。
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold transition-transform hover:scale-105">
                  最新記事を読む
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-bold border-white/20 hover:bg-white/10">
                  取材依頼はこちら
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        </section>

        {/* Info Bar */}
        <div className="bg-white border-b sticky top-16 z-40">
          <div className="container mx-auto px-4 h-12 flex items-center justify-between overflow-x-auto whitespace-nowrap gap-8 no-scrollbar">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <TrendingUp size={16} className="text-primary" />
              <span>注目記事:</span>
              <Link href="#" className="hover:text-primary transition-colors ml-2 underline underline-offset-4">春の新歓特設ページ公開</Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar size={14} />
              <span>{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <section className="py-16 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12 border-b-2 border-slate-200 pb-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">最新のニュース</h2>
                <p className="text-slate-500 mt-1">Campus Highlights & Updates</p>
              </div>
              <Button variant="ghost" className="font-bold gap-2 text-primary hover:text-primary hover:bg-primary/5" asChild>
                <Link href="/category/Campus">
                  全て見る <ArrowRight size={18} />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-slate-500 font-medium tracking-widest uppercase text-sm">Loading Articles</p>
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Newspaper className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">公開中の記事はありません</h3>
                <p className="text-slate-500">管理画面から記事を投稿・公開してください。</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-black mb-6">新聞会を、もっと身近に。</h2>
            <p className="text-lg opacity-90 mb-10">
              公式SNSや公式LINEでは、号外や学内の緊急情報もいち早くお届けしています。
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" size="lg" className="rounded-full font-bold">公式SNSをフォロー</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary p-2 rounded-lg text-white">
                  <Newspaper size={24} />
                </div>
                <span className="font-black text-2xl tracking-tighter text-white">北海学園大学新聞会</span>
              </div>
              <p className="max-w-md leading-relaxed">
                19XX年創設。北海学園大学唯一の公式学生報道機関として、
                学内の真実を追求し、学生生活に資する情報を発信し続けています。
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">カテゴリー</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/category/Campus" className="hover:text-primary transition-colors">学内ニュース</Link></li>
                <li><Link href="/category/Event" className="hover:text-primary transition-colors">イベント</Link></li>
                <li><Link href="/category/Interview" className="hover:text-primary transition-colors">インタビュー</Link></li>
                <li><Link href="/category/Sports" className="hover:text-primary transition-colors">スポーツ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">インフォメーション</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/login" className="hover:text-primary transition-colors">管理者ログイン</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">取材・掲載依頼</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">プライバシーポリシー</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} HGU Newspaper Club. All Rights Reserved.</p>
            <p className="tracking-widest uppercase">Truth & Responsibility</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
