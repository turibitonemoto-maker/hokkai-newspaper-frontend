"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * このアプリは「表示用」であるため、管理画面へのアクセスはトップページへリダイレクトします。
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // 予期せぬエラーを防ぐため、安全にトップページへ戻します
    router.replace('/');
  }, [router]);

  // マウント中は何も表示しないことで、パースエラー等の連鎖を防ぎます
  return null;
}