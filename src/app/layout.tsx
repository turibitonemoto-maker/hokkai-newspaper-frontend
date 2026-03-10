import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: '北海学園大学一部新聞会 | Hokkai Gakuen University Ichibu Newspaper',
  description: '北海学園大学の最新ニュース、イベント、インタビューをお届けする学生新聞公式サイト。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Yuji+Mai&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-white flex flex-col min-h-screen">
        <FirebaseClientProvider>
          {/* ナビゲーションバー (全幅背景) */}
          <Navbar />
          
          <main className="flex-grow flex flex-col">
            <div className="max-w-[1280px] w-full mx-auto bg-white relative flex-grow">
              {/* ナビゲーションバーの高さに合わせてパディングを調整 */}
              <div className="pt-32 md:pt-40">
                {children}
              </div>
            </div>
          </main>

          {/* フッター (全幅背景) */}
          <Footer />
          
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
