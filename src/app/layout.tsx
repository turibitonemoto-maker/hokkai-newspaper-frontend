import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MaintenanceGuard } from '@/components/MaintenanceGuard';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

/**
 * サイトのメタデータ (新ドメイン hgunews.com 最適化版)
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://hgunews.com'), 
  title: {
    default: '北海学園大学新聞会 公式サイト',
    template: '%s | 北海学園大学新聞会'
  },
  description: '1950年創立。北海学園大学の最新ニュースを学生の視点からお届けする公式サイト。',
  keywords: ['北海学園大学', '新聞会', '学生新聞', '札幌', '大学ニュース'],
  verification: {
    google: 'vyBqZRop5RaNAce3rTB3EOwtzl5qlPCp_shVA1fT_oc',
  },
  openGraph: {
    title: '北海学園大学新聞会 公式サイト',
    description: '学生が紡ぐ、北海学園のいま。',
    url: 'https://hgunews.com', 
    siteName: '北海学園大学新聞会',
    locale: 'ja_JP',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  appleWebApp: {
    title: '北海学園大学新聞会',
  },
};

/**
 * ルートレイアウト・コンポーネント
 * サイト全体の物理構造、認証、メンテナンスモード、デザイン規律を定義します。
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Yuji+Mai&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <FirebaseClientProvider>
          <MaintenanceGuard>
            <div className="flex flex-col min-h-screen pt-[104px] md:pt-[144px]">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </MaintenanceGuard>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
