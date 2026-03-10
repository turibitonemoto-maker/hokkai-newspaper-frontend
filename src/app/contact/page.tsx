
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Instagram, ArrowRight } from 'lucide-react';

/**
 * フォーム機能を廃止し、公式メールアドレスとSNSへの連絡を促すページ。
 */
export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest">CONTACT</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">お問い合わせ</h1>
          <p className="text-slate-500 font-bold">
            ご意見、取材依頼、広告掲載、入部希望などは、以下の公式窓口よりお気軽にご連絡ください。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* メールアドレス */}
          <a href="mailto:r06hgunews@gmail.com" className="group">
            <Card className="rounded-[40px] border-none shadow-xl bg-white hover:scale-[1.02] transition-all duration-300 h-full ring-1 ring-slate-100 hover:ring-primary/20">
              <CardContent className="p-10 space-y-6">
                <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center text-primary">
                  <Mail size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                    Email <ArrowRight size={20} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Official Email Address</p>
                  <p className="text-xl font-bold text-slate-900 break-all">r06hgunews@gmail.com</p>
                </div>
              </CardContent>
            </Card>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="group">
            <Card className="rounded-[40px] border-none shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-[1.02] transition-all duration-300 h-full">
              <CardContent className="p-10 space-y-6">
                <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center text-white backdrop-blur-sm">
                  <Instagram size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2 text-white">
                    Instagram <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-white/60 font-black text-[10px] uppercase tracking-widest mb-2">Follow our news</p>
                  <p className="text-xl font-bold">@hgu_ichibu_news</p>
                  <p className="text-xs mt-2 text-white/80 font-medium">DMからもお問い合わせを受け付けています。</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>

        <section className="bg-slate-50 rounded-[48px] p-10 md:p-16 text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-3xl shadow-sm text-slate-400">
                <MapPin size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight">活動拠点</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              北海学園大学 豊平キャンパス内<br />
              文化棟二階 一部新聞会部室
            </p>
            <div className="pt-6 border-t border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hokkai Gakuen University Ichibu Newspaper</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
