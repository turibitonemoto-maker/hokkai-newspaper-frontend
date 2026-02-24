import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Eye, TrendingUp, Newspaper, Plus } from 'lucide-react';
import Link from 'next/link';
import { MOCK_ARTICLES } from '@/lib/mock-data';

export default function AdminPage() {
  const stats = [
    { label: '公開済み記事', value: MOCK_ARTICLES.length.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '今月の閲覧数', value: '12,450', icon: Eye, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'アクティブメンバー', value: '18', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'フォロワー', value: '850', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
          <p className="text-muted-foreground">北海学園大学新聞会の最新状況を把握しましょう。</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/new">
            <Plus size={18} />
            新規記事作成
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-md`}>
                <stat.icon size={16} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">先月比 +12%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>最近の投稿</CardTitle>
            <CardDescription>直近に作成・編集された記事です。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_ARTICLES.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-muted overflow-hidden relative shrink-0">
                      <img src={article.imageUrl} alt="" className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.category} • {article.publishDate}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/edit/${article.id}`}>編集</Link>
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4" asChild>
              <Link href="/admin/articles">すべての記事を表示</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>活動予定</CardTitle>
            <CardDescription>編集会議などのスケジュール</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex flex-col items-center justify-center text-primary shrink-0">
                  <span className="text-xs font-bold leading-none">JUN</span>
                  <span className="text-lg font-bold leading-none">05</span>
                </div>
                <div>
                  <p className="text-sm font-medium">定例編集会議</p>
                  <p className="text-xs text-muted-foreground">18:30〜 @新聞会室</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded bg-accent/10 flex flex-col items-center justify-center text-accent shrink-0">
                  <span className="text-xs font-bold leading-none">JUN</span>
                  <span className="text-lg font-bold leading-none">08</span>
                </div>
                <div>
                  <p className="text-sm font-medium">体育祭 取材</p>
                  <p className="text-xs text-muted-foreground">09:00〜 @豊平グラウンド</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6">予定を追加</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}