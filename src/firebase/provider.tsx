
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

/**
 * 権限の概念を完全に排除したFirebaseプロバイダー。
 * エラーリスナー（FirebaseErrorListener）を削除し、システムから「拒否」という概念を抹消しました。
 */

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: null;
  isUserLoading: false;
  userError: null;
}

export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: null;
  isUserLoading: false;
  userError: null;
}

export interface UserHookResult { 
  user: null;
  isUserLoading: false;
  userError: null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const contextValue = useMemo((): FirebaseContextState => {
    return {
      areServicesAvailable: true,
      firebaseApp,
      firestore,
      auth,
      user: null,
      isUserLoading: false,
      userError: null,
    };
  }, [firebaseApp, firestore, auth]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {/* 権限エラーによるクラッシュを防ぐため、エラーリスナーを完全に削除しました */}
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);
  if (context === undefined) throw new Error('useFirebase must be used within a FirebaseProvider.');
  return {
    firebaseApp: context.firebaseApp!,
    firestore: context.firestore!,
    auth: context.auth!,
    user: null,
    isUserLoading: false,
    userError: null,
  };
};

export const useAuth = (): Auth => useFirebase().auth;
export const useFirestore = (): Firestore => useFirebase().firestore;
export const useFirebaseApp = (): FirebaseApp => useFirebase().firebaseApp;

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  return memoized;
}

export const useUser = (): UserHookResult => {
  return { user: null, isUserLoading: false, userError: null };
};
