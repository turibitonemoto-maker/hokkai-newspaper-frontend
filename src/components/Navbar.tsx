
"use client";

import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

/**
 * 2段構成のナビゲーションバー。
 * 上段（白）: 主要なカテゴリー。
 * 下段（青）: 組織情報や募集情報。
 * 権限の概念は完全に排除されています。
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
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* メインナビゲーション（白） */}
      <div className="w-full border-b bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-primary p-1.5 rounded-lg text-white transition-all group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-primary/20">
              <Newspaper size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-950 hidden sm:inline-block">
              北海学園大学<span className="text-primary">新聞</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar py-2">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all whitespace-nowrap",
                  pathname === link.href 
                    ? "bg-slate-100 text-primary" 
                    : "text-slate-500 hover:text-primary hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* セカンダリナビゲーション（青） */}
      <div className="w-full bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 h-10 flex items-center overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-6 md:gap-10">
            {subLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] whitespace-nowrap hover:text-white/80 transition-colors py-2 border-b-2 border-transparent hover:border-white/40"
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
