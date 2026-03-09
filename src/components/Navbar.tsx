"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

/**
 * 2段構成のナビゲーションバー。
 * 背景（白と青の帯）は画面全幅に広がり、コンテンツは中央の1280px幅に収まる。
 * 配色は 北海(青) 学園(黒) 大学(青) 新聞(黒)。
 * Google Font「Yuji Mai」をロゴに適用。
 */
export function Navbar() {
  const pathname = usePathname();

  const mainLinks = [
    { label: 'トップ', href: '/' },
    { label: 'お知らせ', href: '/category/Announcements' },
    { label: 'キャンパス', href: '/category/Campus' },
    { label: 'イベント', href: '/category/Event' },
    { label: 'インタビュー', href: '/category/Interview' },
    { label: 'スポーツ', href: '/category/Sports' },
  ];

  const subLinks = [
    { label: '北海学園大学新聞とは', href: '#' },
    { label: '会長挨拶', href: '#' },
    { label: '部員募集', href: '#' },
    { label: '広告募集', href: '#' },
    { label: 'お問い合わせ', href: '#' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-md">
      {/* メインナビゲーション（白） - 背景は全幅、コンテンツは中央 */}
      <div className="w-full border-b bg-white">
        <div className="max-w-[1280px] mx-auto px-4 h-24 flex items-center justify-start gap-12">
          <Link href="/" className="flex items-center group shrink-0">
            <div className="font-yuji text-3xl md:text-5xl tracking-tighter">
              <span className="text-primary">北海</span>
              <span className="text-slate-950">学園</span>
              <span className="text-primary">大学</span>
              <span className="text-slate-950">新聞</span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar py-2">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-base md:text-lg font-bold uppercase tracking-wider px-3 py-2 rounded-xl transition-all whitespace-nowrap",
                  pathname === link.href 
                    ? "bg-slate-100 text-primary" 
                    : "text-slate-600 hover:text-primary hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* セカンダリナビゲーション（青） - 背景は全幅、コンテンツは中央 */}
      <div className="w-full bg-primary text-white">
        <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-center overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-8 md:gap-12">
            {subLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs md:text-base font-bold uppercase tracking-[0.05em] whitespace-nowrap hover:text-white/80 transition-colors py-2 border-b-2 border-transparent hover:border-white/40"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
