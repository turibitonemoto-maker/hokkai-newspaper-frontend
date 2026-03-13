'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// モジュールスコープでインスタンスをキャッシュ（ca9エラー対策）
let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

/**
 * Firebaseの各サービスをシングルトンとして初期化します。
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  // 1. Appの初期化（重複を防ぐ）
  if (!cachedApp) {
    const apps = getApps();
    cachedApp = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  }

  // 2. Authの初期化
  if (!cachedAuth) {
    cachedAuth = getAuth(cachedApp);
  }

  // 3. Firestoreの初期化
  if (!cachedDb) {
    cachedDb = getFirestore(cachedApp);
  }

  return {
    firebaseApp: cachedApp,
    auth: cachedAuth,
    firestore: cachedDb
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
