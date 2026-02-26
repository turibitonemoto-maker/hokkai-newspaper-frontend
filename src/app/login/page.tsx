
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

  // 権限チェック関数
  const checkIsAuthorized = (u: any) => {
    return !!(u && (u.email === 'admin@example.com' || u.email?.endsWith('@hgu.jp')));
  };

  const isAuthorized = checkIsAuthorized(user);

  // すでにログインしていて権限がある場合は自動的に管理画面へ
  useEffect(() => {
    if (!isUserLoading && user && isAuthorized) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, isAuthorized, router]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    
    // 常にアカウント選択画面を表示するように設定
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      
      if (checkIsAuthorized(loggedInUser)) {
        toast({ title: "ログイン成功", description: "管理者として認証されました。" });
        router.replace('/admin');
      } else {
        toast({ 
          title: "アクセス権限なし", 
          description: "このアカウントには管理権限がありません。新聞会のメールアドレス（@hgu.jp）を使用してください。", 
          variant: "destructive" 
        });
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        setIsLoggingIn(false);
        return;
      }
      
      console.error("Login error:", error);
      toast({
        title: "ログイン失敗",
        description: "認証中にエラーが発生しました。コンソールでGoogleログインが有効か確認してください。",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    toast({ title: "ログアウト完了", description: "別のアカウントでログイン可能です。" });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-3xl overflow-hidden animate-fade-in">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="space-y-4 pt-10 text-center">
          <div className="flex items-center justify-center">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary ring-8 ring-primary/5">
              <ShieldCheck size={40} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-black tracking-tighter uppercase italic text-slate-900">北海学園大学新聞</CardTitle>
            <CardDescription className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-2">
              管理者コンソール
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-10">
          {user && !isAuthorized ? (
            <div className="space-y-6">
              <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex gap-3">
                <AlertTriangle className="text-destructive shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="text-xs text-destructive font-black uppercase tracking-wider">Unauthorized Account</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    「{user.email}」には管理権限がありません。
                  </p>
                </div>
              </div>
              <Button 
                variant="outline"
                className="w-full h-14 rounded-2xl text-sm font-bold gap-3 border-slate-200 hover:bg-slate-50"
                onClick={handleSignOut}
              >
                <LogOut size={20} />
                別のアカウントでログインし直す
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
                <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  承認された新聞会のGoogleアカウント（@hgu.jp）でのみアクセスできます。
                </p>
              </div>

              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold gap-3 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                onClick={handleGoogleLogin} 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <Mail size={24} />
                    Googleでログイン
                  </>
                )}
              </Button>
            </div>
          )}
          
          <div className="text-center pt-4 border-t border-slate-100">
            <Button variant="link" asChild className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
              <Link href="/">サイトに戻る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
