
"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

/**
 * 2段構成のナビゲーションバー。
 * 配色: 北海(青) 学園(黒) 大学(青) 新聞(黒)。
 * Yuji Maiフォントはロゴのみに使用。
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
    { label: 'コラム・寄稿', href: '/category/Column' },
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
      {/* メインナビゲーション（白） - 背景は全幅、コンテンツは中央1280px */}
      <div className="w-full border-b bg-white">
        <div className="max-w-[1280px] mx-auto px-0 h-24 flex items-center justify-start gap-8 md:gap-12">
          <Link href="/" className="flex items-center group shrink-0">
            <div className="font-yuji text-3xl md:text-4xl tracking-tighter">
              <span className="text-primary">北海</span>
              <span className="text-slate-950">学園</span>
              <span className="text-primary">大学</span>
              <span className="text-slate-950">新聞</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar py-2">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm md:text-base font-bold uppercase tracking-wider px-2 md:px-3 py-2 rounded-xl transition-all whitespace-nowrap",
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

      {/* セカンダリナビゲーション（青） - 背景は全幅、コンテンツは中央1280px */}
      <div className="w-full bg-primary text-white">
        <div className="max-w-[1280px] mx-auto px-0 h-16 flex items-center justify-start overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-6 md:gap-8">
            {subLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs md:text-sm font-bold uppercase tracking-[0.05em] whitespace-nowrap hover:text-white/80 transition-colors py-2 border-b-2 border-transparent hover:border-white/40"
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
