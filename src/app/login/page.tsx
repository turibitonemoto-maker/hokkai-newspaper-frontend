
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 表示用サイトにログイン機能は不要なため、トップページへ戻します。
 */
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
}
