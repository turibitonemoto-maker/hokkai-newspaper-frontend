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

  // 既に初期化済みの場合はグローバルから即座に返す
  if (win[FIREBASE_GLOBAL_KEY]) {
    return win[FIREBASE_GLOBAL_KEY];
  }

  // Appの初期化。既存のものがあれば再利用、なければ新規作成
  let app: FirebaseApp;
  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
  } else {
    app = initializeApp(firebaseConfig);
  }

  // Authの初期化
  const authInstance = getAuth(app);

  // Firestoreの初期化
  const db = getFirestore(app);

  // シングルトンとしてグローバルに保存（他の処理が走る前に登録）
  win[FIREBASE_GLOBAL_KEY] = {
    firebaseApp: app,
    auth: authInstance,
    firestore: db
  };

  // Authの永続性設定。初期化時に一度だけ実行されるようにする
  setPersistence(authInstance, browserLocalPersistence).catch((err) => {
    // 既に設定されている場合などのエラーは無視
    if (err.code !== 'auth/already-initialized') {
      console.warn("Firebase Auth Persistence failed to set:", err);
    }
  });

  return win[FIREBASE_GLOBAL_KEY];
}

/**
 * Googleでログインを実行します。
 */
export async function signInWithGoogle() {
  const { auth } = initializeFirebase();
  if (!auth) return;
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
  if (!auth) return;
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
