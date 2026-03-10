import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest">CONTACT</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">お問い合わせ</h1>
          <p className="text-slate-500 font-bold">
            ご意見、ご感想、取材依頼、広告掲載、入部希望など、お気軽にお問い合わせください。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <Card className="rounded-[40px] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
              <CardContent className="p-10 space-y-10">
                <h3 className="text-2xl font-black tracking-tight">連絡先情報</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Mail className="text-primary shrink-0" size={24} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Email</p>
                      <p className="font-bold">r06hgunews@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Phone className="text-primary shrink-0" size={24} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Phone</p>
                      <p className="font-bold">011-XXX-XXXX（代表）</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin className="text-primary shrink-0" size={24} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Office</p>
                      <p className="font-bold">北海学園大学 豊平キャンパス内<br />文化棟二階</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <form className="space-y-8 bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="font-black text-xs uppercase tracking-widest text-slate-400">お名前</Label>
                  <Input placeholder="北海 太郎" className="rounded-xl h-12 border-slate-100" />
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-xs uppercase tracking-widest text-slate-400">メールアドレス</Label>
                  <Input type="email" placeholder="example@mail.com" className="rounded-xl h-12 border-slate-100" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="font-black text-xs uppercase tracking-widest text-slate-400">お問い合わせ件名</Label>
                <Input placeholder="入部について、取材依頼、など" className="rounded-xl h-12 border-slate-100" />
              </div>

              <div className="space-y-2">
                <Label className="font-black text-xs uppercase tracking-widest text-slate-400">お問い合わせ内容</Label>
                <Textarea placeholder="詳細をご記入ください" className="min-h-[200px] rounded-2xl border-slate-100" />
              </div>

              <Button size="lg" className="w-full rounded-2xl h-16 text-lg font-black bg-slate-900 shadow-xl" type="button">
                内容を送信する（デモ）
              </Button>
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ※送信ボタンは現在デモ用です
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
