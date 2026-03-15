
'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MapPin, History, Target, Footprints, Loader2, AlertCircle } from 'lucide-react';

/**
 * About Us ページ (再構築プロトコル適用版)
 * 指定された Firestore パス (/settings/about) から content フィールドを取得して連動。
 * デザインの骨格と黄金比は死守。
 */
export default function AboutPage() {
  const db = useFirestore();
  
  // プロトコル指定のパス: settings/about
  const aboutRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'about');
  }, [db]);

  const { data: aboutData, isLoading } = useDoc(aboutRef);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Connecting to Archives...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest rounded-full">ABOUT US</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950">
            北海学園大学一部新聞会とは
          </h1>
        </header>

        <section className="max-w-none">
          {aboutData?.content ? (
            <div className={cn(
              "prose prose-slate max-w-none font-medium text-slate-800 mx-auto tracking-wide",
              "prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg md:prose-lg whitespace-pre-wrap"
            )}
            dangerouslySetInnerHTML={{ __html: aboutData.content }}
            />
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-12 text-center">
              <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-400 font-bold">
                NO DATA (連動待機中)<br />
                <span className="text-xs font-medium">管理サイトの「About Us編集」から保存してください。</span>
              </p>
            </div>
          )}
        </section>

        {/* 骨格部分は静的に維持（必要に応じてここも連動可能） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-[40px] border-none shadow-xl bg-slate-50 ring-1 ring-slate-100/50">
            <CardContent className="p-10 space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <Target size={24} />
                <h2 className="text-2xl font-black tracking-tight uppercase italic text-slate-950">私たちの目的</h2>
              </div>
              <p className="text-base leading-relaxed text-slate-600 font-medium">
                記者が紡いできた言葉を、AIのフィルターを通さず純粋に届けること。
                学生の視点から社会や大学の事象を捉え、批判的かつ創造的な言論空間を維持することを目指しています。
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-[40px] border-none shadow-xl bg-slate-50 ring-1 ring-slate-100/50">
            <CardContent className="p-10 space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <Footprints size={24} />
                <h2 className="text-2xl font-black tracking-tight uppercase italic text-slate-950">活動内容</h2>
              </div>
              <p className="text-base leading-relaxed text-slate-600 font-medium">
                定期的な紙面（本紙）の発行、公式ウェブサイトでのニュース配信、学内各部活動への取材、
                および入学式・卒業式などの公式行事の報道写真撮影を行っています。
              </p>
            </CardContent>
          </Card>
        </div>

        <section className="bg-white rounded-[48px] p-10 md:p-16 border border-slate-100 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <History className="text-primary" size={32} />
            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-slate-950">組織概要</h2>
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-3 border-b border-slate-100 pb-6">
              <span className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">団体名</span>
              <span className="col-span-2 font-bold text-slate-900">北海学園大学一部新聞会</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-100 pb-6">
              <span className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">設立</span>
              <span className="col-span-2 font-bold text-slate-900">1950年</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-100 pb-6">
              <span className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">活動拠点</span>
              <div className="col-span-2 space-y-2">
                <span className="block font-bold text-slate-900">北海学園大学 豊平キャンパス 文化棟二階</span>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={12} />
                  <span className="text-[10px] font-medium">北海道札幌市豊平区旭町4丁目1-40</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
