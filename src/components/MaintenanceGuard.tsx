'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ReactNode } from 'react';
import { Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MaintenanceGuardProps {
  children: ReactNode;
}

/**
 * 【こちら表示用サイト】
 * 管理サイト側で設定された status を監視し、稼働状況を表示します。
 * 余計な文言を排除し、シンプルなステータス表示に特化しました。
 */
export function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const db = useFirestore();
  const { user } = useUser();
  
  const siteSettingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'maintenance');
  }, [db]);

  const { data: settings, isLoading } = useDoc(siteSettingsRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isMaintenanceMode = settings?.isMaintenanceMode === true;
  
  // 管理者メールアドレスはガードを回避可能
  const adminEmails = ["r06hgunews@gmail.com", "turibitonemoto@gmail.com"];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  if (isMaintenanceMode && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-xl w-full text-center space-y-8 animate-fade-in">
          <div className="bg-white rounded-[48px] p-12 md:p-16 shadow-2xl shadow-slate-200/60 border border-slate-100">
            <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center text-primary mx-auto mb-10">
              <Construction size={40} />
            </div>
            
            <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black uppercase tracking-widest mb-6">Status: メンテナンス中</Badge>
            
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
              現在、サイトを停止しています
            </h1>
            
            <p className="text-slate-600 font-medium leading-relaxed mb-10 text-lg">
              再開まで今しばらくお待ちください。
            </p>

            <div className="pt-8 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Hokkai Gakuen University Ichibu Newspaper
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isMaintenanceMode && isAdmin && (
        <div className="fixed top-0 left-0 w-full z-[100] bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 text-center shadow-md">
          ADMIN PREVIEW MODE (MAINTENANCE ACTIVE)
        </div>
      )}
      {children}
    </>
  );
}
