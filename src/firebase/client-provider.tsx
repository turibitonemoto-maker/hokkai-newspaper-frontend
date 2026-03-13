'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * Firebaseの初期化を管理し、下位コンポーネントにFirebaseのコンテキストを提供します。
 * クライアントサイドでのみ一度だけ初期化を実行することで、
 * SSR時のエラーやFirestoreの内部状態不整合を防ぎます。
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [services, setServices] = useState<{
    firebaseApp: any;
    auth: any;
    firestore: any;
  } | null>(null);

  useEffect(() => {
    // マウント後に確実に一度だけ実行
    const initialized = initializeFirebase();
    setServices(initialized);
  }, []);

  // 初期化完了までは安全なローディング状態を表示
  if (!services) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Initializing Connection</p>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
