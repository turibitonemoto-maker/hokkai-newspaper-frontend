import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, TrendingUp, Users, Target } from 'lucide-react';
import Link from 'next/link';

export default function AdsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest">ADVERTISING</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">広告募集</h1>
          <p className="text-slate-500 font-bold">
            北海学園大学の学生・教職員へ直接アプローチ可能な広告媒体をご提供します。
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-[32px] border-none shadow-xl bg-slate-50">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary"><Users /></div>
                <h3 className="text-xl font-black">ターゲット</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                北海学園大学の全学生（約X,XXX名）および教職員が主な読者層です。
                地元の若者へ効果的に訴求することが可能です。
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-[32px] border-none shadow-xl bg-slate-50">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary"><Megaphone /></div>
                <h3 className="text-xl font-black">媒体の種類</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                学内配布される紙面広告、および本ウェブサイトへのバナー広告、記事広告など、
                ご予算と目的に合わせたプランをご提案します。
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-2xl space-y-8">
          <h2 className="text-3xl font-black tracking-tighter">広告掲載の流れ</h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shrink-0">1</div>
              <div>
                <h4 className="font-black text-lg">お問い合わせ</h4>
                <p className="text-slate-500 text-sm">下記フォームより、掲載希望の時期や内容をご連絡ください。</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shrink-0">2</div>
              <div>
                <h4 className="font-black text-lg">プランのご提案</h4>
                <p className="text-slate-500 text-sm">詳細をヒアリングの上、最適な掲載プランとお見積りをご提示します。</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shrink-0">3</div>
              <div>
                <h4 className="font-black text-lg">原稿入稿・掲載</h4>
                <p className="text-slate-500 text-sm">内容の確認後、指定の期日までに掲載を開始いたします。</p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-primary rounded-[40px] p-10 text-white text-center space-y-6 shadow-2xl shadow-primary/30">
          <h3 className="text-2xl font-black italic">地域の企業様、商店様からの応援をお待ちしております</h3>
          <Button size="lg" variant="secondary" className="rounded-full h-14 px-10 font-black text-primary shadow-lg" asChild>
            <Link href="/contact">広告掲載の資料請求・問い合わせ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
