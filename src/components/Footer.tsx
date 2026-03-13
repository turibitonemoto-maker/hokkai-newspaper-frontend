"use client";

import { useUser, signInWithGoogle, logout } from '@/firebase';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Settings } from 'lucide-react';

/**
 * 画面の端から端まで広がる黒いフッター。
 * 管理者向けのログイン・ログアウト機能を控えめに追加。
 */
export function Footer() {
  const { user } = useUser();
  const adminEmails = ["r06hgunews@gmail.com", "turibitonemoto@gmail.com"];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  return (
    <footer className="w-full bg-slate-950 text-slate-600 py-12 md:py-20 text-center border-t border-slate-900 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-8 md:mb-12 opacity-50">
          <div className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">
            <span className="text-primary">北海</span>
            <span className="text-white">学園</span>
            <span className="text-primary">大学</span>
            <span className="text-white">新聞</span>
          </div>
        </div>

        {/* 管理者用メニュー */}
        <div className="mb-8 flex justify-center gap-4">
          {user ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-700">Logged in as {user.email}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => logout()}
                className="text-slate-700 hover:text-white hover:bg-white/5 text-[9px] font-black uppercase tracking-widest gap-2"
              >
                <LogOut size={12} /> Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signInWithGoogle()}
              className="text-slate-800 hover:text-slate-600 text-[9px] font-black uppercase tracking-widest gap-2"
            >
              <LogIn size={12} /> Admin Login
            </Button>
          )}
        </div>

        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-500">
          &copy; {new Date().getFullYear()} 北海学園大学一部新聞会 / REPORTING FOR THE FUTURE
        </p>
      </div>
    </footer>
  );
}
