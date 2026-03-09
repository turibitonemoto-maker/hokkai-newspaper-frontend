
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/Navbar';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Yuji+Mai&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-white">
        <FirebaseClientProvider>
          <div className="max-w-[1280px] mx-auto bg-white min-h-screen relative">
            <Navbar />
            {/* ナビゲーションバーが固定(160px)されているため、その分の余白を追加 */}
            <div className="pt-40">
              {children}
            </div>
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
