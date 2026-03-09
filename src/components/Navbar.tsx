
"use client";

import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

/**
 * 権限の概念を完全に排除したナビゲーションバー。
 * 主要なカテゴリーへの直接リンクを配置しました。
 */
export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: 'トップ', href: '/' },
    { label: 'お知らせ', href: '/category/Announcements' },
    { label: 'キャンパス', href: '/category/Campus' },
    { label: 'イベント', href: '/category/Event' },
    { label: 'インタビュー', href: '/category/Interview' },
    { label: 'スポーツ', href: '/category/Sports' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-primary p-1.5 rounded-lg text-white transition-all group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-primary/20">
            <Newspaper size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-950 hidden sm:inline-block">
            北海学園大学<span className="text-primary">新聞</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-6 overflow-x-auto no-scrollbar py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all whitespace-nowrap",
                pathname === link.href 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:text-primary hover:bg-slate-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
