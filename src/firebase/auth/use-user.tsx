'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

/**
 * 認証ユーザーの状態をリアルタイムで取得するフック。
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    const auth = getAuth();
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
