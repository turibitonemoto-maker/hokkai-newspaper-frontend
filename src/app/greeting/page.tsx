
'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * 会長挨拶ページ (ビルド・最適化版)
 * 「content」フィールドを唯一の真実として読み込み、
 * 日本仕様の黄金比密度（leading-6, my-3）を適用します。
 */
export default function GreetingPage() {
  const db = useFirestore();
  
  const greetingRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'president_greeting');
  }, [db]);

  const { data: greeting, isLoading } = useDoc(greetingRef);

  const defaultData = {
    title: "「伝える力」で、大学をより豊かに。",
    content: `<p>北海学園大学一部新聞会のウェブサイトを訪問いただき、ありがとうございます。</p>
<p>私たちは1950年の創立以来、学生の視点から大学の「いま」を記録し続けてきました。</p>
<p>これからも、学生、教職員、そして地域社会の皆様を繋ぐ架け橋として、真摯に活動を続けてまいります。</p>`,
    authorName: "北海学園大学一部新聞会 会長",
    authorImageUrl: ""
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Synchronizing...</p>
      </div>
    );
  }

  // 「content」フィールドを最優先。
  const displayTitle = greeting?.title || defaultData.title;
  const displayContent = greeting?.content || greeting?.message || defaultData.content;
  const displayAuthorName = greeting?.authorName || defaultData.authorName;
  const displayAuthorImageUrl = greeting?.authorImageUrl || defaultData.authorImageUrl;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest">MESSAGE</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950">会長挨拶</h1>
        </header>

        <div className="space-y-12">
          {/* 会長写真 */}
          <div className="flex justify-center">
            <div className="w-64 h-80 relative rounded-[40px] overflow-hidden shadow-2xl bg-slate-50 ring-8 ring-white">
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
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black uppercase text-[10px] tracking-widest text-center px-4 leading-relaxed">
                  Official Photo<br />Available
                </div>
              )}
            </div>
          </div>
          
          {/* メッセージ本文：日本仕様の黄金比密度を適用 */}
          <div className="space-y-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 text-center leading-tight">
              {displayTitle}
            </h2>
            <div 
              className={cn(
                "prose prose-slate max-w-none font-medium text-slate-700 mx-auto transition-all",
                "prose-p:leading-6 prose-p:my-3 prose-li:my-1 prose-img:rounded-xl prose-img:shadow-md",
                "md:prose-lg"
              )}
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />

            {/* 署名 */}
            <div className="pt-10 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">President of Ichibu Newspaper Group</p>
              <p className="text-3xl md:text-5xl font-black italic text-slate-950">{displayAuthorName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
