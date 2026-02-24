import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, Share2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = MOCK_ARTICLES.find(a => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12">
        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in">
          {/* Article Header */}
          <div className="p-6 lg:p-10">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-secondary text-primary border-none font-bold">
                {article.category}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock size={12} /> 読了時間 約3分
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold mb-8 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-muted/50">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {article.author.charAt(0)}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold">{article.author}</p>
                    <p className="text-muted-foreground text-xs">新聞会記者</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar size={14} />
                  {article.publishDate}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Share2 size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Printer size={20} />
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video w-full">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              data-ai-hint={article.imageHint}
            />
          </div>

          {/* AI Summary Section */}
          {article.summary && (
            <div className="px-6 lg:px-10 py-6 bg-secondary/50 m-6 lg:m-10 rounded-xl border border-accent/20">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <span className="text-xs font-bold uppercase tracking-widest bg-primary text-white px-2 py-0.5 rounded">AI Summary</span>
              </div>
              <p className="text-sm italic text-foreground/80 leading-relaxed">
                {article.summary}
              </p>
            </div>
          )}

          {/* Article Content */}
          <div className="px-6 lg:px-10 py-8 lg:pb-16 article-content text-lg text-foreground/90 font-light leading-relaxed">
            {article.content.split('\n').map((para, i) => (
              para ? <p key={i}>{para}</p> : <br key={i} />
            ))}
          </div>

          <Separator className="mx-6 lg:mx-10 w-auto" />
          
          <div className="p-6 lg:p-10 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              北海学園大学新聞会 - 記事の無断転載を禁じます
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">前の記事</Button>
              <Button variant="outline" size="sm">次の記事</Button>
            </div>
          </div>
        </article>

        {/* Sidebar / More News Placeholder (Mobile shows below) */}
        <section className="max-w-4xl mx-auto mt-12">
          <h3 className="text-2xl font-bold mb-6">関連ニュース</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_ARTICLES.filter(a => a.id !== article.id).slice(0, 2).map(a => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
