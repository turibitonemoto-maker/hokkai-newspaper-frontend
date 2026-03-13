'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Next.jsのホットリロード時でもFirestoreの内部状態を矛盾させないため
 * globalThisを使用してインスタンスを物理的に1つに固定します。
 */
declare global {
  var __firebase_app: FirebaseApp | undefined;
  var __firebase_auth: Auth | undefined;
  var __firebase_db: Firestore | undefined;
}

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  // 1. Firebase App の初期化（シングルトン）
  if (!globalThis.__firebase_app) {
    const apps = getApps();
    globalThis.__firebase_app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  }

  // 2. Auth の初期化（シングルトン）
  if (!globalThis.__firebase_auth) {
    globalThis.__firebase_auth = getAuth(globalThis.__firebase_app);
  }

  // 3. Firestore の初期化（シングルトン）
  if (!globalThis.__firebase_db) {
    globalThis.__firebase_db = getFirestore(globalThis.__firebase_app);
  }

  return {
    firebaseApp: globalThis.__firebase_app,
    auth: globalThis.__firebase_auth,
    firestore: globalThis.__firebase_db
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
