
'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * About Us ページ (動的連動・プロ仕様タイポグラフィ版)
 * 管理サイトからの編集内容をリアルタイムに反映。
 * 「leading-relaxed」と「mb-6」による日本仕様の黄金比を適用。
 */
export default function AboutPage() {
  const db = useFirestore();
  
  const aboutRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'about_us');
  }, [db]);

  const { data: about, isLoading } = useDoc(aboutRef);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
      </div>
    );
  }

  // デフォルト値の設定 (Firestoreにデータがない場合のバックアップ)
  const displayTitle = about?.title || "北海学園大学一部新聞会とは";
  const displayContent = about?.content || `
    <p>北海学園大学一部新聞会は、北海学園大学唯一の学生新聞団体です。学内の出来事から地域の話題、学生の活躍、教員のインタビューなど、「いま」の北海学園を広く深く伝えることを使命としています。</p>
    <p>私たちは単なるニュース配信に留まらず、学生の視点から社会を捉え、考えるきっかけを提供することを目指しています。</p>
  `;
  const displayPurpose = about?.purpose || "学内の正確な情報を共有し、学生同士、また大学と学生の橋渡しとなること。言論の自由を尊重し、学生ならではの鋭い視点で真実を追求すること。";
  const displayActivities = about?.activities || "月刊または不定期での新聞発行、ウェブサイトでのリアルタイムなニュース更新、著名人への独占インタビュー、スポーツ大会の現地取材、イベントレポートなど。";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest rounded-full">ABOUT US</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950">{displayTitle}</h1>
        </header>

        <section className="max-w-none">
          {/* メイン説明: プロ仕様の黄金比タイポグラフィ */}
          <div 
            className={cn(
              "prose prose-slate max-w-none font-medium text-slate-700 mx-auto tracking-wide",
              "prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg",
              "md:prose-lg whitespace-pre-wrap"
            )}
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-[40px] border-none shadow-xl bg-slate-50 ring-1 ring-slate-100/50">
            <CardContent className="p-10 space-y-6">
              <h2 className="text-2xl font-black tracking-tight text-primary uppercase italic">私たちの目的</h2>
              <div className="text-base leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
                {displayPurpose}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[40px] border-none shadow-xl bg-slate-50 ring-1 ring-slate-100/50">
            <CardContent className="p-10 space-y-6">
              <h2 className="text-2xl font-black tracking-tight text-primary uppercase italic">活動内容</h2>
              <div className="text-base leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
                {displayActivities}
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="bg-white rounded-[48px] p-10 md:p-16 border border-slate-100 shadow-2xl">
          <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase italic">組織概要</h2>
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
              <span className="col-span-2 font-bold text-slate-900">北海学園大学 豊平キャンパス 文化棟二階</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
