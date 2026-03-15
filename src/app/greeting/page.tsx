'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, ShieldCheck, Lock } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

/**
 * 会長挨拶ページ (コピーガード＆黄金比密度版)
 * 日本仕様の行間(leading-6)と段落余白(my-3)を適用。
 * コピーガード (select-none) を実装。
 */
export default function GreetingPage() {
  const db = useFirestore();
  
  const greetingRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'president_greeting');
  }, [db]);

  const { data: greeting, isLoading } = useDoc(greetingRef);

  const displayAuthorImageUrl = useMemo(() => {
    let url = greeting?.authorImageUrl || "";
    if (url.includes('drive.google.com')) {
      url = url.replace(/\/(view|edit|share|usp=drivesdk).*/g, '/preview');
    }
    return url;
  }, [greeting?.authorImageUrl]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
      </div>
    );
  }

  const displayTitle = greeting?.title || "「伝える力」で、大学をより豊かに。";
  const displayContent = greeting?.content || `<p>北海学園大学一部新聞会のウェブサイトへようこそ。私たちは1950年の創立以来、学生の視点から大学の「いま」を記録し続けてきました。</p>`;
  const displayAuthorName = greeting?.authorName || "北海学園大学一部新聞会 会長";

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 animate-fade-in select-none">
      <div className="max-w-3xl mx-auto space-y-20">
        <header className="text-center space-y-6">
          <Badge variant="outline" className="px-6 py-1.5 border-primary text-primary font-black uppercase tracking-widest rounded-full">
            OFFICIAL MESSAGE
          </Badge>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950">会長挨拶</h1>
        </header>

        <div className="space-y-16">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-80 relative rounded-[48px] overflow-hidden shadow-2xl bg-slate-50 ring-8 ring-white">
                {displayAuthorImageUrl ? (
                  <Image
                    src={displayAuthorImageUrl}
                    alt={displayAuthorName}
                    fill
                    sizes="256px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4 bg-slate-100">
                    <User size={64} className="opacity-20" />
                    <span className="font-black text-[9px] uppercase tracking-widest">Portrait</span>
                  </div>
                )}
                {/* 透明シールドレイヤー */}
                <div className="absolute inset-0 bg-transparent z-50 cursor-default" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-emerald-500 shadow-xl rounded-2xl p-2.5 text-white border-4 border-white">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>
          
          <div className="space-y-12">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-950 text-center leading-tight">
              {displayTitle}
            </h2>
            <div 
              className={cn(
                "prose prose-slate max-w-none font-medium text-slate-700 mx-auto",
                "prose-p:leading-6 prose-p:my-3 prose-li:my-1",
                "md:prose-lg"
              )}
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />

            <div className="pt-12 border-t border-slate-100 text-center relative">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">President of Ichibu Newspaper Group</p>
              <p className="text-3xl md:text-5xl font-black italic text-slate-950 tracking-tighter">{displayAuthorName}</p>
              <div className="absolute -bottom-8 right-0 opacity-10 flex items-center gap-2">
                <Lock size={12} />
                <span className="text-[8px] font-black uppercase tracking-widest">Copyright Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
