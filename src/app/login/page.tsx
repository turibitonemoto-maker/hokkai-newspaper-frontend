
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Mail, AlertTriangle, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // あなたのメールアドレスを管理者として許可
  const isAuthorized = !!(user && (user.email === 'admin@example.com' || user.email?.toLowerCase().endsWith('@hgu.jp')));

  useEffect(() => {
    if (!isUserLoading && user && isAuthorized) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, isAuthorized, router]);

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      const loggedInAuthorized = !!(loggedInUser && (loggedInUser.email === 'admin@example.com' || loggedInUser.email?.toLowerCase().endsWith('@hgu.jp')));
      
      if (loggedInAuthorized) {
        toast({ title: "ログイン成功", description: "管理者として認証されました。" });
        router.replace('/admin');
      } else {
        await signOut(auth);
        toast({ 
          title: "アクセス権限なし", 
          description: "許可された管理者メールアドレスを使用してください。", 
          variant: "destructive" 
        });
        setIsLoggingIn(false);
      }
    } catch (error: any) {
      setIsLoggingIn(false);
      if (error.code === 'auth/popup-closed-by-user') return;
      toast({
        title: "ログイン失敗",
        description: "認証中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    toast({ title: "ログアウト完了", description: "別のアカウントでログイン可能です。" });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-[40px] overflow-hidden bg-white">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="space-y-4 pt-12 text-center">
          <div className="flex items-center justify-center">
            <div className="bg-primary/10 p-5 rounded-[24px] text-primary">
              <ShieldCheck size={40} strokeWidth={2.5} />
            </div>
          </div>
          <CardTitle className="text-3xl font-black uppercase italic">北海学園大学新聞</CardTitle>
          <CardDescription className="font-black uppercase tracking-[0.2em] text-[10px]">
            ADMINISTRATION CONSOLE
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pb-12 px-10">
          {user && !isAuthorized ? (
            <div className="space-y-6">
              <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-6 text-center space-y-2">
                <AlertTriangle className="text-destructive mx-auto" size={24} />
                <p className="text-sm font-bold text-slate-600">
                  「{user.email}」には管理権限がありません。
                </p>
              </div>
              <Button variant="outline" className="w-full h-16 rounded-2xl font-black" onClick={handleSignOut}>
                <LogOut className="mr-2" /> アカウントを切り替える
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Button className="w-full h-16 rounded-2xl text-lg font-black gap-4 shadow-xl shadow-primary/25" onClick={handleGoogleLogin} disabled={isLoggingIn}>
                {isLoggingIn ? <Loader2 className="animate-spin" /> : <><Mail /> Googleでログイン</>}
              </Button>
            </div>
          )}
          <div className="text-center pt-6 border-t border-slate-50">
            <Button variant="link" asChild className="text-slate-400 font-black text-[10px] tracking-[0.2em]">
              <Link href="/">← サイトに戻る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
