'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Instagram, ArrowRight, ExternalLink, MessageSquare } from 'lucide-react';

/**
 * 公式SNS集約ページ (デネブ版・URL最新化)
 * X (旧Twitter)、Instagram、Noteへのゲートウェイ。
 */
export default function SocialPage() {
  const snsLinks = [
    {
      name: 'X (旧Twitter)',
      id: '@HGU_news',
      url: 'https://x.com/HGU_news',
      description: '北海学園大学の最新ニュースをリアルタイムで発信しています。',
      color: 'bg-slate-950',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      id: '@hgu_news',
      url: 'https://www.instagram.com/hgu_news?igsh=YmRybG1mMWJ3MHBm',
      description: '取材現場の様子や、紙面に載りきらなかった写真を公開中。',
      color: 'bg-gradient-to-br from-purple-600 to-pink-500',
      icon: <Instagram size={24} />
    },
    {
      name: 'Note',
      id: '北海学園大学新聞',
      url: 'https://note.com/lucky_minnow287',
      description: '長期連載や、記者によるコラムなどをアーカイブしています。',
      color: 'bg-emerald-500',
      icon: <MessageSquare size={24} />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-6">
          <Badge variant="outline" className="px-6 py-1.5 border-primary text-primary font-black uppercase tracking-widest rounded-full">
            OFFICIAL SNS
          </Badge>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950">公式SNS</h1>
          <p className="text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed">
            北海学園大学新聞の公式アカウントです。各プラットフォームで独自の情報を発信しています。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {snsLinks.map((sns) => (
            <a key={sns.name} href={sns.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
              <Card className="h-full rounded-[40px] border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ring-1 ring-slate-100 flex flex-col">
                <div className={`${sns.color} p-10 text-white flex justify-center items-center`}>
                  <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-md">
                    {sns.icon}
                  </div>
                </div>
                <CardContent className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{sns.name}</h3>
                      <ExternalLink size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-primary font-black text-xs tracking-widest uppercase">{sns.id}</p>
                    <p className="text-sm text-slate-500 leading-6 font-medium">
                      {sns.description}
                    </p>
                  </div>
                  <div className="pt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                    FOLLOW US <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <section className="bg-slate-50 rounded-[48px] p-10 md:p-16 text-center space-y-6">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 italic">報道の最前線を、あなたのタイムラインへ。</h2>
          <p className="text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">
            取材依頼や情報提供は、各SNSのダイレクトメッセージ（DM）からも受け付けております。
          </p>
        </section>
      </div>
    </div>
  );
}
