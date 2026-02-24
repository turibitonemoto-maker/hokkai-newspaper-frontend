import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import type { Category } from '@/lib/types';
import { ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = slug as Category;
  const filteredArticles = MOCK_ARTICLES.filter(a => a.category === category);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">ホーム</Link>
          <ChevronRight size={14} />
          <span className="text-primary font-bold">{category}</span>
        </nav>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Filter size={24} className="text-primary" />
            <h1 className="text-4xl font-bold">{category}</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {category}に関する最新の記事一覧です。北海学園大学のいまをお届けします。
          </p>
        </header>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-muted-foreground">記事が見つかりませんでした。</h2>
            <p className="mt-2">別のカテゴリーを探すか、ホームに戻ってください。</p>
            <Link href="/" className="inline-block mt-4 text-primary font-bold hover:underline">ホームへ戻る</Link>
          </div>
        )}
      </main>

      <footer className="bg-primary py-8 text-primary-foreground mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-60">
            &copy; {new Date().getFullYear()} 北海学園大学新聞会
          </p>
        </div>
      </footer>
    </div>
  );
}