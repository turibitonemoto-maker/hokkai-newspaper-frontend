'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

/**
 * 認証ユーザーの状態をリアルタイムで取得するフック。
 * initializeFirebase() によって初期化された後の使用を想定しています。
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    let auth;
    try {
      // グローバルに初期化済みのAuthインスタンスを取得
      auth = getAuth();
    } catch (e) {
      // まだ初期化されていない場合は待機
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsUserLoading(false);
      },
      (error) => {
        setUserError(error);
        setIsUserLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, isUserLoading, userError };
}
