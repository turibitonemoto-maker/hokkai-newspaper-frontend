'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// グローバルオブジェクトにインスタンスを保持するためのキー
const FIREBASE_GLOBAL_KEY = '__FIREBASE_SERVICES__';

/**
 * Firebaseの各サービスを初期化します。
 * ブラウザのグローバルオブジェクト (window) にインスタンスを保持することで、
 * Next.jsのホットリロード等による重複初期化エラー（ca9等）を徹底的に防ぎます。
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any
    };
  }

  const win = window as any;

  // 既に初期化済みの場合はグローバルから返す
  if (win[FIREBASE_GLOBAL_KEY]) {
    return win[FIREBASE_GLOBAL_KEY];
  }

  // Appの初期化
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  // Authの初期化
  const authInstance = getAuth(app);

  // Firestoreの初期化
  const db = getFirestore(app);

  // 非同期で永続性を設定（エラーは無視せず警告のみ）
  setPersistence(authInstance, browserLocalPersistence).catch((err) => {
    console.warn("Firebase Auth Persistence failed to set:", err);
  });

  // グローバルに保存して使い回す
  win[FIREBASE_GLOBAL_KEY] = {
    firebaseApp: app,
    auth: authInstance,
    firestore: db
  };

  return win[FIREBASE_GLOBAL_KEY];
}

/**
 * Googleでログインを実行します。
 */
export async function signInWithGoogle() {
  const { auth } = initializeFirebase();
  const provider = new GoogleAuthProvider();
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Google Sign In Error:", error);
    throw error;
  }
}

/**
 * ログアウトを実行します。
 */
export async function logout() {
  const { auth } = initializeFirebase();
  return await signOut(auth);
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
