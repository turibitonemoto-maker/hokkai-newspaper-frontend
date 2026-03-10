import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest">ABOUT US</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">北海学園大学一部新聞会とは</h1>
        </header>

        <section className="prose prose-slate prose-lg max-w-none font-medium text-slate-700 leading-relaxed">
          <p>
            北海学園大学一部新聞会は、北海学園大学唯一の学生新聞団体です。学内の出来事から地域の話題、学生の活躍、教員のインタビューなど、「いま」の北海学園を広く深く伝えることを使命としています。
          </p>
          <p>
            私たちは単なるニュース配信に留まらず、学生の視点から社会を捉え、考えるきっかけを提供することを目指しています。
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-[32px] border-none shadow-xl bg-slate-50">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-primary">私たちの目的</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                学内の正確な情報を共有し、学生同士、また大学と学生の橋渡しとなること。
                言論の自由を尊重し、学生ならではの鋭い視点で真実を追求すること。
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-[32px] border-none shadow-xl bg-slate-50">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-primary">活動内容</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                月刊または不定期での新聞発行、ウェブサイトでのリアルタイムなニュース更新、
                著名人への独占インタビュー、スポーツ大会の現地取材、イベントレポートなど。
              </p>
            </CardContent>
          </Card>
        </div>

        <section className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-2xl">
          <h2 className="text-3xl font-black mb-8 tracking-tighter">組織概要</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-3 border-b border-slate-100 pb-4">
              <span className="font-black text-slate-400 text-xs uppercase tracking-widest">団体名</span>
              <span className="col-span-2 font-bold">北海学園大学一部新聞会</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-100 pb-4">
              <span className="font-black text-slate-400 text-xs uppercase tracking-widest">設立</span>
              <span className="col-span-2 font-bold">19XX年（詳細手直し予定）</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-100 pb-4">
              <span className="font-black text-slate-400 text-xs uppercase tracking-widest">活動拠点</span>
              <span className="col-span-2 font-bold">豊平キャンパス（詳細手直し予定）</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
