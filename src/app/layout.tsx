
import type { Metadata } from 'next';
import { Inter, Yuji_Mai } from 'next/font/google';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
    <html lang="ja" className={`${inter.variable} ${yujiMai.variable}`}>
      <body className="font-sans antialiased bg-white flex flex-col min-h-screen">
        <FirebaseClientProvider>
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
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
