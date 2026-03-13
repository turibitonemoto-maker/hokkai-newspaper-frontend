'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * Firebase Client Provider (最適化版)
 * 表示サイトの読み込み「重さ」を解消するため、マウント時の処理を簡略化しました。
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [services, setServices] = useState<{
    firebaseApp: any;
    auth: any;
    firestore: any;
  } | null>(null);

  useEffect(() => {
    // 実行をわずかに遅延させて初期レンダリングを優先
    const timer = setTimeout(() => {
      const initialized = initializeFirebase();
      setServices(initialized);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  if (!services || !services.firebaseApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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
