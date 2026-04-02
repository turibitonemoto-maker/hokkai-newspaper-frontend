import type { Metadata } from 'next';
import { Inter, Yuji_Mai } from 'next/font/google';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MaintenanceGuard } from '@/components/MaintenanceGuard';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const yujiMai = Yuji_Mai({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-yuji',
});

/**
 * サイトのメタデータ (クローラー申請・SEO強化版)
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://hokkai-gakuen-news.web.app'),
  title: {
    default: '北海学園大学新聞会 公式サイト',
    template: '%s | 北海学園大学新聞会'
  },
  description: '1950年創立。北海学園大学の最新ニュースを学生の視点からお届けする公式サイト。',
  keywords: ['北海学園大学', '新聞会', '学生新聞', '札幌', '大学ニュース'],
  verification: {
    // Google Search Console の所有権認証コードを物理的に適用
    google: 'vyBqZRop5RaNAce3rTB3EOwtzl5qlPCp_shVA1fT_oc',
  },
  openGraph: {
    title: '北海学園大学新聞会 公式サイト',
    description: '学生が紡ぐ、北海学園のいま。',
    url: 'https://hokkai-gakuen-news.web.app',
    siteName: '北海学園大学新聞会',
    locale: 'ja_JP',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${yujiMai.variable}`}>
      <body className="font-sans antialiased bg-white flex flex-col min-h-screen overflow-x-hidden">
        <FirebaseClientProvider>
          <MaintenanceGuard>
            <Navbar />
            <main className="flex-grow flex flex-col">
              <div className="max-w-[1280px] w-full mx-auto bg-white relative flex-grow">
                <div className="pt-32 md:pt-40">
                  {children}
                </div>
              </div>
            </main>
            <Footer />
            <Toaster />
          </MaintenanceGuard>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
