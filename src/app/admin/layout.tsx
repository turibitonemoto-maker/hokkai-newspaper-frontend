
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 管理者画面は現在完全に無効化されています。
 * アクセスがあった場合はトップページへリダイレクトします。
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">ADMIN MODE DISABLED</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">トップページへ戻ります...</p>
      </div>
    </div>
  );
}
