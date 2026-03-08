
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // 管理画面は現在無効化されているため、トップページへリダイレクト
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900">ADMIN MODE DISABLED</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">トップページへ戻ります...</p>
      </div>
    </div>
  );
}
