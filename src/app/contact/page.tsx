'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Instagram, ArrowRight, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * お問い合わせページ (表示用サイト専用・リンク最新化)
 * 荒らし対策のためフォームを廃止し、外部SNSおよびメール連絡に一本化。
 */
export default function ContactPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const email = "r06hgunews@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast({
      title: "メールアドレスをコピーしました",
      description: "クリップボードに保存されました。",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest">CONTACT</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950">お問い合わせ</h1>
          <p className="text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed">
            取材依頼、広告掲載、入部希望などは、以下の公式窓口より直接ご連絡ください。<br />
            ※荒らし対策のため、Webフォームを廃止し外部SNSに集約しております。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* メールアドレス */}
          <button 
            onClick={handleCopyEmail}
            className="group text-left w-full focus:outline-none focus:ring-2 focus:ring-primary rounded-[40px]"
          >
            <Card className="rounded-[40px] border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-300 h-full ring-1 ring-slate-100">
              <CardContent className="p-10 space-y-6">
                <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center text-primary">
                  {copied ? <Check size={32} /> : <Mail size={32} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2 text-slate-900">
                    Email <Copy size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </h3>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Click to Copy</p>
                  <p className="text-xl font-bold text-slate-900 break-all">{email}</p>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Instagram */}
          <a href="https://www.instagram.com/hgu_news?igsh=YmRybG1mMWJ3MHBm" target="_blank" rel="noopener noreferrer" className="group">
            <Card className="rounded-[40px] border-none shadow-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white hover:shadow-2xl transition-all duration-300 h-full">
              <CardContent className="p-10 space-y-6">
                <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center text-white backdrop-blur-sm">
                  <Instagram size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2 text-white">
                    Instagram <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-white/70 font-black text-[10px] uppercase tracking-widest mb-2">Follow our news</p>
                  <p className="text-xl font-bold">@hgu_news</p>
                  <p className="text-xs mt-2 text-white/90 font-medium">DMからのご連絡も可能です。</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>

        <section className="bg-slate-50 rounded-[48px] p-10 md:p-16 text-center space-y-6">
          <div className="bg-white p-4 rounded-3xl shadow-sm text-slate-400 w-fit mx-auto mb-4">
            <MapPin size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">活動拠点</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            北海学園大学 豊平キャンパス内<br />
            文化棟二階 北海学園大学新聞部室
          </p>
        </section>
      </div>
    </div>
  );
}
