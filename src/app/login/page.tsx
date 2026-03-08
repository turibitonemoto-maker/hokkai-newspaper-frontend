
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ログイン機能は完全に無効化されています。
 * アクセスがあった場合は即座にトップページへ戻します。
 */
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Redirecting to home...</p>
    </div>
  );
}
