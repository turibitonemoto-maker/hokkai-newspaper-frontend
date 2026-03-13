'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * Firebaseの初期化を管理し、下位コンポーネントにFirebaseのコンテキストを提供します。
 * ハイドレーションエラーを防ぐため、マウント完了後（useEffect実行後）にのみFirebaseサービスを提供します。
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [services, setServices] = useState<{
    firebaseApp: any;
    auth: any;
    firestore: any;
  } | null>(null);

  useEffect(() => {
    // クライアントサイドでのマウントが完了した時点で初期化を実行
    const initialized = initializeFirebase();
    setServices(initialized);
    setIsMounted(true);
  }, []);

  // マウント前はサーバーとクライアントで同じローディングUIを返し、ハイドレーションエラーを防止
  if (!isMounted || !services || !services.firebaseApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Connecting to Archives</p>
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
