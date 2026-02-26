
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    // 常にアカウント選択画面を表示させるための設定
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // メールアドレスの制限チェック
      if (user.email && (user.email === 'admin@example.com' || user.email.endsWith('@hgu.jp'))) {
        toast({ title: "ログイン成功", description: "管理者として認証されました。" });
        router.push('/admin');
      } else {
        toast({ 
          title: "アクセス権限なし", 
          description: "このアカウントには管理権限がありません。新聞会のメールアドレス（@hgu.jp）を使用してください。", 
          variant: "destructive" 
        });
        // 権限がない場合は、混乱を避けるためにサインアウトしておく（オプション）
        // await auth.signOut();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Google認証中にエラーが発生しました。";
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Googleログインが有効になっていません。Firebaseコンソールの [Authentication] > [Sign-in method] でGoogleを有効にしてください。";
      }

      toast({
        title: "ログイン失敗",
        description: errorMessage,
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
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <AlertTriangle className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              この記事管理システムには、承認された新聞会のGoogleアカウント（@hgu.jp）でのみアクセスできます。
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
            <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-tighter">
              ※クリックするとアカウント選択画面が開きます
            </p>
            <Button variant="link" asChild className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
              <Link href="/">サイトに戻る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
