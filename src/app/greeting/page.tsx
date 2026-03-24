'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

/**
 * 会長挨拶ページ (完全連動・物理パージ版)
 * 固定テキストを廃止。Firestore (/settings/president_greeting) からのみ取得。
 * 黄金比 (leading-6, my-3) を適用。
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
      if (url.includes('/view') || url.includes('/edit') || url.includes('/share')) {
        url = url.replace(/\/(view|edit|share|usp=drivesdk).*/g, '/preview');
      }
    }
    return url;
  }, [greeting?.authorImageUrl]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Message...</p>
      </div>
    );
  }

  if (!greeting) {
    return (
      <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center text-center">
        <div className="bg-emerald-50 p-10 rounded-[48px] border-2 border-dashed border-emerald-200">
          <AlertCircle className="text-emerald-500 mx-auto mb-6" size={48} />
          <h1 className="text-2xl font-black mb-4">メッセージが未設定です</h1>
          <p className="text-slate-500 text-sm font-medium">管理サイトから挨拶文を保存してください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-20">
        <header className="text-center space-y-6">
          <Badge variant="outline" className="px-6 py-1.5 border-primary text-primary font-black uppercase tracking-widest rounded-full">
            OFFICIAL MESSAGE
          </Badge>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-950">会長挨拶</h1>
        </header>

        <div className="space-y-16">
          <div className="flex justify-center">
            <div className="w-64 h-80 relative rounded-[48px] overflow-hidden shadow-2xl bg-slate-50 ring-8 ring-white">
              {displayAuthorImageUrl ? (
                <Image
                  src={displayAuthorImageUrl}
                  alt={greeting.authorName || ""}
                  fill
                  sizes="256px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4 bg-slate-100">
                  <User size={64} className="opacity-20" />
                  <span className="font-black text-[9px] uppercase tracking-widest">No Portrait</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-12">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-950 text-center leading-tight">
              {greeting.title}
            </h2>
            <div 
              className={cn(
                "prose prose-slate max-w-none font-medium text-slate-700 mx-auto tracking-wide",
                "prose-p:leading-6 prose-p:my-3 prose-p:text-lg",
                "md:prose-lg"
              )}
              dangerouslySetInnerHTML={{ __html: greeting.content || "" }}
            />

            <div className="pt-12 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">President, Hokkai Gakuen University Newspaper</p>
              <p className="text-3xl md:text-5xl font-black italic text-slate-950 tracking-tighter">{greeting.authorName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
