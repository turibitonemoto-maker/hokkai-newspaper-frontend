'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * Firebase Client Provider
 * 最適化：マウント前の描画を極限まで軽くし、ハイドレーションエラーと初期ロード時間を最小化。
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [services, setServices] = useState<{
    firebaseApp: any;
    auth: any;
    firestore: any;
  } | null>(null);

  useEffect(() => {
    const initialized = initializeFirebase();
    setServices(initialized);
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
