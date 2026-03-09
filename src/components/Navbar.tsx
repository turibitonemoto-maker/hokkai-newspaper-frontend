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
 * モバイルとPCで高さを最適化。
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
      {/* 1段目: ロゴと検索 (モバイル: h-20, PC: h-24) */}
      <div className="w-full border-b bg-white relative">
        <div className="max-w-[1280px] mx-auto px-0 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-10 overflow-hidden flex-grow">
            <Link href="/" className="flex items-center group shrink-0">
              <div className="font-yuji text-2xl md:text-4xl tracking-tighter leading-none">
                <span className="text-primary">北海</span>
                <span className="text-slate-950">学園</span>
                <span className="text-primary">大学</span>
                <span className="text-slate-950">新聞</span>
              </div>
            </Link>

            {!isSearchOpen && (
              <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar py-2 animate-in fade-in duration-500">
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

          <div className="flex items-center gap-2 md:gap-4 ml-2">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300 w-full max-w-md">
                <div className="relative flex-grow">
                  <Input 
                    autoFocus
                    placeholder="検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-full border-slate-200 bg-slate-50 h-9 md:h-10 w-[120px] md:w-[300px] pr-8 text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="rounded-full h-8 w-8">
                  <X size={18} className="text-slate-400" />
                </Button>
              </form>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full hover:bg-slate-50 transition-colors h-10 w-10 md:h-12 md:w-12"
              >
                <Search size={20} className="text-slate-400 md:size-6" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2段目: サブリンク (モバイル: h-12, PC: h-16) */}
      <div className="w-full bg-primary text-white">
        <div className="max-w-[1280px] mx-auto px-0 h-12 md:h-16 flex items-center justify-start overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-4 md:gap-8 px-4 md:px-0">
            {subLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[10px] md:text-sm font-bold uppercase tracking-[0.05em] whitespace-nowrap hover:text-white/80 transition-colors py-2 border-b-2 border-transparent hover:border-white/40"
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
