
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
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    
    const provider = new GoogleAuthProvider();
    // 常にアカウント選択画面を表示
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
        // 権限がない場合は即座にサインアウトして、ユーザーに知らせる
        await signOut(auth);
        toast({ 
          title: "アクセス権限なし", 
          description: "新聞会のメールアドレス（@hgu.jp）を使用してください。", 
          variant: "destructive" 
        });
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // ユーザーが閉じた場合はエラーを出さない
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
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">セッションを確認中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-[40px] overflow-hidden animate-fade-in bg-white">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="space-y-4 pt-12 text-center">
          <div className="flex items-center justify-center">
            <div className="bg-primary/10 p-5 rounded-[24px] text-primary ring-8 ring-primary/5">
              <ShieldCheck size={40} strokeWidth={2.5} />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black tracking-tighter uppercase italic text-slate-950">北海学園大学新聞</CardTitle>
            <CardDescription className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
              ADMINISTRATION CONSOLE
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-12 px-10">
          {user && !isAuthorized ? (
            <div className="space-y-6">
              <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-6 flex flex-col items-center text-center gap-3">
                <AlertTriangle className="text-destructive" size={24} />
                <div className="space-y-1">
                  <p className="text-[10px] text-destructive font-black uppercase tracking-widest">Unauthorized Access</p>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed">
                    「{user.email}」<br />
                    には管理権限がありません。
                  </p>
                </div>
              </div>
              <Button 
                variant="outline"
                className="w-full h-16 rounded-2xl text-sm font-black gap-3 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
                onClick={handleSignOut}
              >
                <LogOut size={20} />
                別のアカウントで入り直す
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-100/50 rounded-2xl p-5 flex gap-4">
                <div className="bg-amber-100 p-2 rounded-xl h-fit shrink-0">
                  <AlertTriangle className="text-amber-700" size={18} />
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-bold">
                  北海学園大学新聞会から承認された Googleアカウント（@hgu.jp）を使用してログインしてください。
                </p>
              </div>

              <Button 
                className="w-full h-16 rounded-2xl text-lg font-black gap-4 shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95" 
                onClick={handleGoogleLogin} 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <Mail size={24} strokeWidth={2.5} />
                    Googleでログイン
                  </>
                )}
              </Button>
            </div>
          )}
          
          <div className="text-center pt-6 border-t border-slate-50">
            <Button variant="link" asChild className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors">
              <Link href="/">← サイトに戻る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
