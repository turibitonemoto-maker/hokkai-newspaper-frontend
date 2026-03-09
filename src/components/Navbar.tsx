"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * 2段構成のナビゲーションバー。
 * 1段目の右端に検索機能を追加。
 * 配色: 北海(青) 学園(黒) 大学(青) 新聞(黒)。
 * Yuji Maiフォントはロゴのみに使用。
 */
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-md bg-white">
      {/* メインナビゲーション（白） - 背景は全幅、コンテンツは中央1280px */}
      <div className="w-full border-b bg-white relative">
        <div className="max-w-[1280px] mx-auto px-0 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10 overflow-hidden flex-grow">
            <Link href="/" className="flex items-center group shrink-0">
              <div className="font-yuji text-4xl tracking-tighter">
                <span className="text-primary">北海</span>
                <span className="text-slate-950">学園</span>
                <span className="text-primary">大学</span>
                <span className="text-slate-950">新聞</span>
              </div>
            </Link>

            {!isSearchOpen && (
              <nav className="hidden lg:flex items-center gap-2 overflow-x-auto no-scrollbar py-2 animate-in fade-in duration-500">
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-bold uppercase tracking-wider px-2 py-2 rounded-xl transition-all whitespace-nowrap",
                      pathname === link.href 
                        ? "bg-slate-100 text-primary" 
                        : "text-slate-600 hover:text-primary hover:bg-slate-50"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4 ml-4">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300 w-full max-w-md">
                <div className="relative flex-grow">
                  <Input 
                    autoFocus
                    placeholder="キーワードを入力して検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-full border-slate-200 bg-slate-50 h-10 w-[200px] md:w-[300px] pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="rounded-full">
                  <X size={20} className="text-slate-400" />
                </Button>
              </form>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full hover:bg-slate-50 transition-colors"
              >
                <Search size={24} className="text-slate-400 hover:text-primary" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* セカンダリナビゲーション（青） - 背景は全幅、コンテンツは中央1280px */}
      <div className="w-full bg-primary text-white">
        <div className="max-w-[1280px] mx-auto px-0 h-16 flex items-center justify-start overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-8">
            {subLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-bold uppercase tracking-[0.05em] whitespace-nowrap hover:text-white/80 transition-colors py-2 border-b-2 border-transparent hover:border-white/40"
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
