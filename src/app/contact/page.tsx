
'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  name: z.string().min(1, { message: 'お名前を入力してください' }),
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  subject: z.string().optional(),
  message: z.string().min(5, { message: 'メッセージは5文字以上で入力してください' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (!db) return;
    setIsSubmitting(true);

    try {
      const inquiriesRef = collection(db, 'inquiries');
      
      // 管理側仕様に準拠したデータ作成
      await addDocumentNonBlocking(inquiriesRef, {
        name: data.name,
        email: data.email,
        subject: data.subject || '無題のお問い合わせ',
        message: data.message,
        createdAt: serverTimestamp(),
        isRead: false,
      });

      setIsSuccess(true);
      toast({
        title: "送信完了",
        description: "お問い合わせを受け付けました。内容を確認次第ご連絡いたします。",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "送信エラー",
        description: "送信に失敗しました。時間をおいて再度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <h3 className="text-2xl font-black tracking-tight text-white">連絡先情報</h3>
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
            {isSuccess ? (
              <div className="bg-white p-12 md:p-20 rounded-[40px] border border-slate-100 shadow-2xl text-center space-y-8 animate-fade-in">
                <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-primary">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black tracking-tight">送信が完了しました</h2>
                  <p className="text-slate-500 font-bold">
                    お問い合わせありがとうございます。内容を確認後、担当者より折り返しご連絡させていただきます。
                  </p>
                </div>
                <Button 
                  onClick={() => setIsSuccess(false)} 
                  variant="outline" 
                  className="rounded-full px-10 h-14 font-black"
                >
                  新しいお問い合わせを送信する
                </Button>
              </div>
            ) : (
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8 bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="font-black text-xs uppercase tracking-widest text-slate-400">お名前</Label>
                    <Input 
                      placeholder="北海 太郎" 
                      className="rounded-xl h-12 border-slate-100 focus:ring-primary"
                      {...form.register('name')}
                    />
                    {form.formState.errors.name && (
                      <p className="text-destructive text-[10px] font-bold">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-xs uppercase tracking-widest text-slate-400">メールアドレス</Label>
                    <Input 
                      type="email" 
                      placeholder="example@mail.com" 
                      className="rounded-xl h-12 border-slate-100 focus:ring-primary"
                      {...form.register('email')}
                    />
                    {form.formState.errors.email && (
                      <p className="text-destructive text-[10px] font-bold">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-black text-xs uppercase tracking-widest text-slate-400">お問い合わせ件名</Label>
                  <Input 
                    placeholder="入部について、取材依頼、など" 
                    className="rounded-xl h-12 border-slate-100 focus:ring-primary"
                    {...form.register('subject')}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-black text-xs uppercase tracking-widest text-slate-400">お問い合わせ内容</Label>
                  <Textarea 
                    placeholder="詳細をご記入ください" 
                    className="min-h-[200px] rounded-2xl border-slate-100 focus:ring-primary"
                    {...form.register('message')}
                  />
                  {form.formState.errors.message && (
                    <p className="text-destructive text-[10px] font-bold">{form.formState.errors.message.message}</p>
                  )}
                </div>

                <Button 
                  size="lg" 
                  className="w-full rounded-2xl h-16 text-lg font-black bg-slate-900 shadow-xl" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      送信中...
                    </>
                  ) : (
                    '内容を送信する'
                  )}
                </Button>
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  ※お問い合わせ内容は管理者に通知されます
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
