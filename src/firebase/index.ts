
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Next.js 15のホットリロード時におけるFirestore内部状態エラー（ID: ca9）を物理的に遮断するため、
 * globalThisを使用してインスタンスを完全に1つに固定するスーパーシングルトン・パターンを採用。
 */
declare global {
  var __firebase_app: FirebaseApp | undefined;
  var __firebase_auth: Auth | undefined;
  var __firebase_db: Firestore | undefined;
}

/**
 * Firebaseの初期化を行い、シングルトンインスタンスを返します。
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  // 1. Firebase App のシングルトン固定
  if (!globalThis.__firebase_app) {
    const apps = getApps();
    globalThis.__firebase_app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  }

  // 2. Auth のシングルトン固定
  if (!globalThis.__firebase_auth) {
    globalThis.__firebase_auth = getAuth(globalThis.__firebase_app);
  }

  // 3. Firestore のシングルトン固定
  if (!globalThis.__firebase_db) {
    globalThis.__firebase_db = getFirestore(globalThis.__firebase_app);
  }

  return {
    firebaseApp: globalThis.__firebase_app,
    auth: globalThis.__firebase_auth,
    firestore: globalThis.__firebase_db
  };
}

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

export async function logout() {
  const { auth } = initializeFirebase();
  if (!auth) return;
  return await signOut(auth);
}

/**
 * 名前空間の衝突（useUserの重複等）を避けるため、フックは provider.tsx からのみエクスポートします。
 * use-user.tsx からの直接エクスポートは行いません。
 */
export { 
  useUser, 
  useFirestore, 
  useAuth, 
  useFirebaseApp, 
  useFirebase, 
  useMemoFirebase 
} from './provider'; 

export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
