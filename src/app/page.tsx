
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Newspaper, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const db = useFirestore();

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
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Newspaper size={16} />
              <span>北海学園大学 新聞会 公式</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              キャンパスの「いま」を、<br />学生の視点で切り取る。
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              北海学園大学新聞会は、学内のニュース、イベント、学生インタビューなどを通じて、大学生活をより豊かにする情報を発信しています。
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="rounded-full gap-2">
                最新記事を読む <ArrowRight size={18} />
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent hidden lg:block" />
        </section>

        {/* Latest News Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">最新のニュース</h2>
            <Button variant="ghost" asChild>
              <Link href="/category/Campus">すべて見る</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary mb-4" size={40} />
              <p className="text-muted-foreground">記事を読み込んでいます...</p>
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article as any} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
              <p className="text-muted-foreground">現在、公開されている記事はありません。</p>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-1">北海学園大学新聞会</h3>
              <p className="text-sm text-muted-foreground">HOKKAI GAKUEN UNIVERSITY NEWSPAPER CLUB</p>
            </div>
            <div className="flex gap-6 text-sm font-medium">
              <Link href="/login" className="hover:text-primary transition-colors">管理者ログイン</Link>
              <Link href="#" className="hover:text-primary transition-colors">利用規約</Link>
              <Link href="#" className="hover:text-primary transition-colors">プライバシーポリシー</Link>
            </div>
          </div>
          <hr className="my-8" />
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} 北海学園大学新聞会 All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
