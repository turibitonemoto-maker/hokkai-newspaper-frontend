
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // メールアドレスの制限チェック（ルール側でも制御していますが、UI側でメッセージを出すため）
      if (user.email && (user.email === 'admin@example.com' || user.email.endsWith('@hgu.jp'))) {
        toast({ title: "ログイン成功", description: "管理者として認証されました。" });
        router.push('/admin');
      } else {
        toast({ 
          title: "アクセス権限なし", 
          description: "このアカウントには管理権限が付与されていません。", 
          variant: "destructive" 
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "ログイン失敗",
        description: "Google認証中にエラーが発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-3xl overflow-hidden">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="space-y-4 pt-10 text-center">
          <div className="flex items-center justify-center">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary ring-8 ring-primary/5">
              <ShieldCheck size={40} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-black tracking-tighter">ADMIN LOGIN</CardTitle>
            <CardDescription className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-2">
              北海学園大学新聞 管理コンソール
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-10">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <p className="text-xs text-slate-500 leading-relaxed font-medium text-center">
              この記事管理システムには、承認された新聞会のGoogleアカウントでのみアクセスできます。
            </p>
          </div>

          <Button 
            className="w-full h-14 rounded-2xl text-lg font-bold gap-3 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Mail size={24} />
                Googleでログイン
              </>
            )}
          </Button>
          
          <div className="text-center">
            <Button variant="link" asChild className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
              <Link href="/">サイトに戻る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
