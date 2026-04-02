import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Users, Camera, PenTool, Layout } from 'lucide-react';
import Link from 'next/link';

export default function RecruitPage() {
  const roles = [
    {
      title: '記者・ライター',
      description: '学内のニュース、インタビュー、コラムの執筆を担当。あなたの視点で記事を形にします。',
      icon: <PenTool size={32} />
    },
    {
      title: 'カメラマン',
      description: 'スポーツ大会やイベント、インタビュー現場の撮影を担当。決定的な瞬間を記録します。',
      icon: <Camera size={32} />
    },
    {
      title: '編集・デザイン',
      description: '紙面のレイアウトやウェブサイトの管理を担当。情報を美しく、読みやすく整えます。',
      icon: <Layout size={32} />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest">JOIN US</Badge>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter">部員募集</h1>
          <p className="text-slate-500 font-bold max-w-2xl mx-auto">
            未経験者大歓迎！北海学園大学の「いま」を一緒に作り上げませんか？
            学部・学年を問わず、意欲ある仲間を募集しています。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <Card key={role.title} className="rounded-[40px] border-none shadow-xl bg-white hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center space-y-6">
                <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-primary">
                  {role.icon}
                </div>
                <h3 className="text-xl font-black">{role.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{role.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="bg-slate-900 text-white rounded-[48px] p-8 md:p-16 space-y-12 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-black text-center tracking-tighter">北海学園大学新聞会で得られること</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-primary shrink-0" size={24} />
              <p className="font-bold">取材・執筆スキルが身につく</p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-primary shrink-0" size={24} />
              <p className="font-bold">著名人やリーダーから直接話を聞く機会</p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-primary shrink-0" size={24} />
              <p className="font-bold">他学部、多学年の仲間との深いネットワーク</p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-primary shrink-0" size={24} />
              <p className="font-bold">自分の作った成果が形になり、多くの人に届く喜び</p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Button size="lg" className="rounded-full h-16 px-12 text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20" asChild>
            <Link href="/contact">入部希望・見学の問い合わせ</Link>
          </Button>
          <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">お気軽にご連絡ください！</p>
        </div>
      </div>
    </div>
  );
}
