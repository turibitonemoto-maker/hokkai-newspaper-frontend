import Image from 'next/image';
import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import { ArrowRight, Newspaper } from 'lucide-react';

export default function Home() {
  const featuredArticle = MOCK_ARTICLES.find(a => a.featured) || MOCK_ARTICLES[0];
  const latestArticles = MOCK_ARTICLES.filter(a => a.id !== featuredArticle.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Featured Article */}
        <section className="mb-12 animate-fade-in">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg lg:flex">
            <div className="relative h-64 lg:h-auto lg:w-3/5">
              <Image
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                fill
                className="object-cover"
                priority
                data-ai-hint={featuredArticle.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 lg:hidden">
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  注目記事
                </span>
              </div>
            </div>
            
            <div className="p-8 lg:w-2/5 flex flex-col justify-center">
              <span className="hidden lg:inline-block bg-accent/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start mb-4">
                注目記事
              </span>
              <h2 className="text-3xl font-bold mb-4 leading-tight lg:text-4xl text-primary">
                {featuredArticle.title}
              </h2>
              <p className="text-muted-foreground mb-6 line-clamp-3">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span>{featuredArticle.author}</span>
                <span>•</span>
                <span>{featuredArticle.publishDate}</span>
              </div>
              <Button asChild className="w-fit gap-2">
                <Link href={`/articles/${featuredArticle.id}`}>
                  記事を読む <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Latest Articles Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Newspaper className="text-primary" />
              <h2 className="text-2xl font-bold">最新の記事</h2>
            </div>
            <Link href="/category/Campus" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              すべて見る <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article, idx) => (
              <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter / Subscription Placeholder */}
        <section className="bg-primary text-primary-foreground rounded-2xl p-8 lg:p-12 text-center animate-fade-in shadow-xl">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-white">北海学園大学新聞会をフォロー</h2>
          <p className="max-w-2xl mx-auto mb-8 opacity-90">
            最新の学内ニュース、イベント情報、教員・学生インタビューを定期的にお届けします。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="メールアドレスを入力" 
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button variant="secondary" className="px-8 font-bold">購読する</Button>
          </div>
        </section>
      </main>

      <footer className="bg-primary py-12 text-primary-foreground mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">北海学園大学新聞会</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              1950年代より続く、北海学園大学公認の学生新聞組織です。学内外のニュースを学生の視点から発信しています。
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">カテゴリー</h4>
            <ul className="text-sm space-y-2 opacity-80">
              <li><Link href="/category/Campus" className="hover:text-accent">学内ニュース</Link></li>
              <li><Link href="/category/Event" className="hover:text-accent">イベント</Link></li>
              <li><Link href="/category/Interview" className="hover:text-accent">インタビュー</Link></li>
              <li><Link href="/category/Sports" className="hover:text-accent">スポーツ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">お問い合わせ</h4>
            <p className="text-sm opacity-80 mb-2">
              北海道札幌市豊平区旭町4丁目1-40<br />
              北海学園大学 豊平キャンパス内
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="#" className="hover:text-accent">Twitter</Link>
              <Link href="#" className="hover:text-accent">Instagram</Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 border-t border-white/10 mt-12 pt-8 text-center text-xs opacity-60">
          &copy; {new Date().getFullYear()} 北海学園大学新聞会. All rights reserved.
        </div>
      </footer>
    </div>
  );
}