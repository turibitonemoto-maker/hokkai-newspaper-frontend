import { Badge } from '@/components/ui/badge';

export default function GreetingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-16">
        {/* ヘッダー: 他のページと統一して中央揃え */}
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest">MESSAGE</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">会長挨拶</h1>
        </header>

        <div className="space-y-12">
          {/* 写真: 中央に配置 */}
          <div className="flex justify-center">
            <div className="w-64 h-80 relative rounded-[40px] overflow-hidden shadow-2xl bg-slate-100 ring-8 ring-white">
              {/* 会長の写真が入る予定 */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-black uppercase text-[10px] tracking-widest text-center px-4">
                Photo<br />Placeholder
              </div>
            </div>
          </div>
          
          {/* メッセージ本文: 中央寄りのレイアウト */}
          <div className="space-y-8 text-center md:text-left">
            <div className="prose prose-slate prose-xl max-w-none font-medium leading-relaxed text-slate-800 space-y-6">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 text-center">
                「伝える力」で、大学をより豊かに。
              </h2>
              <p>
                北海学園大学一部新聞会のウェブサイトを訪問いただき、ありがとうございます。
              </p>
              <p>
                私たちの活動は、学生の声に耳を傾け、それを形にして届けることにあります。情報が溢れる現代だからこそ、学内で何が起きているのか、何が求められているのかを真摯に取材することが重要だと考えています。
              </p>
              <p>
                これからも、北海学園大学の「いま」を切り取り、学生の皆さんの知的好奇心を刺激するような情報を発信し続けてまいります。
              </p>
            </div>

            {/* 署名部分 */}
            <div className="pt-10 border-t border-slate-100 text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">President of Ichibu Newspaper Group</p>
              <p className="text-3xl md:text-4xl font-black italic">会長名（詳細手直し予定）</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
