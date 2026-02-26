'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

/**
 * Firebase SDKの初期化と、ブラウザ間での認証共有を確実にするための設定を行います。
 */
export function initializeFirebase() {
  let firebaseApp: FirebaseApp;

  if (!getApps().length) {
    try {
      // Firebase App Hosting環境下での自動初期化を試行
      firebaseApp = initializeApp();
    } catch (e) {
      // 開発環境や手動設定が必要な場合のフォールバック
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    firebaseApp = getApp();
  }

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  // 認証の永続化をLOCALに設定（別タブやブラウザ再起動後もログインを維持）
  // 非同期処理だが、トップレベルでの呼び出しにより初期化プロセスの一部として組み込む
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.error("Firebase Auth Persistence Error:", err);
  });

  return {
    firebaseApp,
    auth,
    firestore
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
