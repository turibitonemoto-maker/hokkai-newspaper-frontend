'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * 開発中のホットリロードによる ID: ca9 (Unexpected state) エラーを防ぐため
 * ブラウザのグローバル空間にインスタンスを確実に保持するシングルトン管理。
 */
const getGlobal = () => (typeof window !== 'undefined' ? (window as any) : {});

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  const globalScope = getGlobal();

  // 1. Firebase App の初期化
  if (!globalScope._firebaseApp) {
    const apps = getApps();
    globalScope._firebaseApp = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  }

  // 2. Auth の初期化
  if (!globalScope._firebaseAuth) {
    globalScope._firebaseAuth = getAuth(globalScope._firebaseApp);
  }

  // 3. Firestore の初期化
  if (!globalScope._firebaseDb) {
    globalScope._firebaseDb = getFirestore(globalScope._firebaseApp);
  }

  return {
    firebaseApp: globalScope._firebaseApp,
    auth: globalScope._firebaseAuth,
    firestore: globalScope._firebaseDb
  };
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
