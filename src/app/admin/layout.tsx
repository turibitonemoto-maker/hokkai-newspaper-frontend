"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 管理者画面は現在完全に無効化されています。
 * アクセスがあった場合はトップページへ即座にリダイレクトします。
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
}