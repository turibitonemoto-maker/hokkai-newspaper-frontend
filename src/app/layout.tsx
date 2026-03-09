import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: '北海学園大学新聞 | Hokkai Gakuen University Newspaper',
  description: '北海学園大学の最新ニュース、イベント、インタビューをお届けする学生新聞公式サイト。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-body antialiased bg-slate-100">
        <FirebaseClientProvider>
          {/* サイト全体を中央に配置し、左右に余白を作るラッパー */}
          <div className="max-w-[1280px] mx-auto bg-white min-h-screen shadow-2xl relative overflow-x-hidden border-x border-slate-200">
            {children}
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
