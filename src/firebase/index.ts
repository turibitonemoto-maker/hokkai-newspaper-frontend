'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Firebaseの各サービスを初期化します。
 * サーバーサイドレンダリング(SSR)中はブラウザ専用のAPIをスキップします。
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any
    };
  }

  if (!getApps().length) {
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      console.error("Firebase Initialization Error:", e);
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    firebaseApp = getApp();
  }

  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);

  // Authの永続性設定（ブラウザ専用）
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.error("Firebase Auth Persistence Error:", err);
  });

  return {
    firebaseApp,
    auth,
    firestore
  };
}

/**
 * Googleでログインを実行します。
 */
export async function signInWithGoogle() {
  const auth = getAuth();
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
  const auth = getAuth();
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
