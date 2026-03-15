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
 * サイトのメタデータ (最終・完全同期版)
 * アイコンを正式な icon.png に固定。
 */
export const metadata: Metadata = {
  title: '北海学園大学新聞 公式サイト',
  description: '1950年創立。北海学園大学の最新ニュースを学生の視点からお届けする公式サイト。',
  keywords: ['北海学園大学', '新聞会', '学生新聞'],
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
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
