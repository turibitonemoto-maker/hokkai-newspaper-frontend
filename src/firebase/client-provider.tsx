'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * Firebase Client Provider (正常化版)
 * ハイドレーション・ミスマッチを防ぐため、常に children をレンダリングします。
 * 条件付きのフルスクリーン・ローダーを廃止し、ChunkLoadError を回避します。
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [services, setServices] = useState<{
    firebaseApp: any;
    auth: any;
    firestore: any;
  } | null>(null);

  useEffect(() => {
    // マウント時に同期的に初期化
    const initialized = initializeFirebase();
    setServices(initialized);
  }, []);

  // services が null の状態（サーバーサイドおよび初回マウント時）でも、
  // children を透過的にレンダリングすることで、レイアウトの整合性を保ちます。
  return (
    <FirebaseProvider
      firebaseApp={services?.firebaseApp ?? null}
      auth={services?.auth ?? null}
      firestore={services?.firestore ?? null}
    >
      {children}
    </FirebaseProvider>
  );
}
