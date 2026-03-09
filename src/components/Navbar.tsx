"use client";

import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

/**
 * 2段構成の中央集中型ナビゲーションバー。
 * ロゴの配色: 北海(青) 学園(黒) 大学(青) 新聞(黒)
 * 常に上部に固定されるように sticky 設定を維持。
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
    <header className="sticky top-0 z-50 w-full shadow-md bg-white">
      {/* メインナビゲーション（白） - 中央集中型 */}
      <div className="w-full border-b bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-24 flex items-center justify-center gap-10 md:gap-16">
          <Link href="/" className="flex items-center gap-4 group shrink-0">
            <div className="bg-primary p-2.5 rounded-xl text-white transition-all group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-primary/20">
              <Newspaper size={32} />
            </div>
            <div className="font-bold text-2xl md:text-3xl tracking-tighter hidden sm:inline-block">
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

      {/* セカンダリナビゲーション（青） - 中央集中型 */}
      <div className="w-full bg-primary text-white shadow-inner">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center overflow-x-auto no-scrollbar">
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
