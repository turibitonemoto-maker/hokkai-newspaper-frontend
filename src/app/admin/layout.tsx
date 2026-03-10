"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 【表示用アプリ限定】
 * このプロジェクトは表示専用です。管理機能は別プロジェクトへ移行されました。
 * 管理画面へのアクセスはすべてトップページへリダイレクトされます。
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // 物理的にアクセスを遮断
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse text-slate-300 font-black tracking-widest uppercase text-xs">
        Redirecting to Display Mode...
      </div>
    </div>
  );
}
