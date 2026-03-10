"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 2段構成のナビゲーションバー。
 * ロゴは「北海学園大学新聞」とし、団体正式名称とは使い分け。
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
    { label: '北海学園大学一部新聞会とは', href: '/about' },
    { label: '会長挨拶', href: '/greeting' },
    { label: '部員募集', href: '/recruit' },
    { label: '広告募集', href: '/ads' },
    { label: 'お問い合わせ', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // モバイルで最初に表示する数
  const mobileVisibleCount = 3;
  const mobileVisibleLinks = mainLinks.slice(0, mobileVisibleCount);
  const mobileHiddenLinks = mainLinks.slice(mobileVisibleCount);

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-md bg-white">
      {/* 1段目: ロゴと主要メニュー */}
      <div className="w-full border-b bg-white relative">
        <div className="max-w-[1280px] mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8 flex-grow">
            <Link href="/" className="flex items-center group shrink-0">
              <div className="font-yuji text-2xl md:text-4xl tracking-tighter leading-none whitespace-nowrap">
                <span className="text-primary">北海</span>
                <span className="text-slate-950">学園</span>
                <span className="text-primary">大学</span>
                <span className="text-slate-950">新聞</span>
              </div>
            </Link>

            {!isSearchOpen && (
              <nav className="flex items-center gap-1 md:gap-2 py-2 animate-in fade-in duration-500 overflow-hidden">
                {/* PC版: すべて表示 */}
                <div className="hidden md:flex items-center gap-1">
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-sm font-bold uppercase tracking-wider px-3 py-2 rounded-xl transition-all whitespace-nowrap",
                        pathname === link.href 
                          ? "bg-slate-100 text-primary" 
                          : "text-slate-600 hover:text-primary hover:bg-slate-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* モバイル版: 一部表示 + その他 */}
                <div className="flex md:hidden items-center gap-0.5">
                  {mobileVisibleLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1.5 rounded-lg transition-all whitespace-nowrap",
                        pathname === link.href 
                          ? "bg-slate-100 text-primary" 
                          : "text-slate-600 hover:text-primary hover:bg-slate-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-[10px] font-bold uppercase tracking-wider px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-0.5">
                        その他 <ChevronDown size={10} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl min-w-[120px]">
                      {mobileHiddenLinks.map((link) => (
                        <DropdownMenuItem key={link.href} asChild className="focus:bg-slate-50 focus:text-primary rounded-lg cursor-pointer">
                          <Link href={link.href} className="w-full text-xs font-bold py-2">
                            {link.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-4">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300 w-full max-w-md">
                <div className="relative flex-grow">
                  <Input 
                    autoFocus
                    placeholder="キーワードで検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-full border-slate-200 bg-slate-50 h-10 md:h-12 w-[160px] md:w-[300px] pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4 md:size-5" />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="rounded-full h-10 w-10">
                  <X size={20} className="text-slate-400" />
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

      {/* 2段目: サブリンク */}
      <div className="w-full bg-primary text-white">
        <div className="max-w-[1280px] mx-auto px-4 h-12 md:h-16 flex items-center justify-start overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-4 md:gap-8">
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
