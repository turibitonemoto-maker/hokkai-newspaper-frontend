import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function GreetingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest">MESSAGE</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">会長挨拶</h1>
        </header>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3 aspect-[3/4] relative rounded-[40px] overflow-hidden shadow-2xl bg-slate-100">
            {/* 会長の写真が入る予定 */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-black uppercase text-xs tracking-widest">Photo Placeholder</div>
          </div>
          
          <div className="flex-grow space-y-8">
            <div className="prose prose-slate prose-xl max-w-none font-medium leading-relaxed text-slate-800">
              <h2 className="text-3xl font-black tracking-tight mb-6">「伝える力」で、大学をより豊かに。</h2>
              <p>
                北海学園大学新聞のウェブサイトを訪問いただき、ありがとうございます。
              </p>
              <p>
                私たちの活動は、学生の声に耳を傾け、それを形にして届けることにあります。情報が溢れる現代だからこそ、学内で何が起きているのか、何が求められているのかを真摯に取材することが重要だと考えています。
              </p>
              <p>
                これからも、北海学園大学の「いま」を切り取り、学生の皆さんの知的好奇心を刺激するような情報を発信し続けてまいります。
              </p>
            </div>

            <div className="pt-10 border-t border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">President of Newspaper Group</p>
              <p className="text-3xl font-black italic">会長名（詳細手直し予定）</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
