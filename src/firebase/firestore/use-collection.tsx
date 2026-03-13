
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
      (err: FirestoreError) => {
        // インデックス不足 (FAILED_PRECONDITION) の場合は詳細をコンソールに出力し、UI側へ通知
        if (err.code === 'failed-precondition') {
          console.group('⚠️ Firestore Index Required');
          console.warn('このクエリ（フィルタとソートの組み合わせ）にはインデックスが必要です。');
          console.warn('以下のURLをクリックして管理サイト側で作成してください:');
          console.info(err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)?.[0] || 'Consoleで作成してください');
          console.groupEnd();
        } else {
          console.error("Firestore Listen Error:", err);
        }
        
        setData([]); // クラッシュを防ぐため空配列を返す
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
