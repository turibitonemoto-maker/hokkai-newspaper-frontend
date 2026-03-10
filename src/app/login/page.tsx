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

  return null;
}
