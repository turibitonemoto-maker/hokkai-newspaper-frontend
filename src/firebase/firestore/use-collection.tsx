'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * インデックス不足や権限エラー時にアプリをクラッシュさせないよう強化。
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: WithId<T>[] = [];
        snapshot.forEach((doc) => {
          results.push({ ...(doc.data() as T), id: doc.id });
        });
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      async (err: FirestoreError) => {
        // インデックス不足 (FAILED_PRECONDITION) の場合は詳細をコンソールに出力
        if (err.code === 'failed-precondition') {
          console.group('⚠️ Firestore Index Required');
          console.warn('このクエリにはインデックスが必要です。');
          console.warn(err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)?.[0] || 'Consoleで作成してください');
          console.groupEnd();
        } 
        
        // 権限エラー (PERMISSION_DENIED) の場合はコンテキスト付きエラーを放出
        if (err.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: (memoizedTargetRefOrQuery as any).path || 'unknown',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
        }

        setData([]);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]);

  if(memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
    throw new Error('Target was not properly memoized using useMemoFirebase');
  }
  return { data, isLoading, error };
}
