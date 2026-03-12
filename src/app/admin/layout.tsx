
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 表示用サイトにおいて管理機能は不要なため、
 * このルートにアクセスした場合はすべてトップページへリダイレクトします。
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
}
