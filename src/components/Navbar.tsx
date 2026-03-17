"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, X, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * ナビゲーション (黄金スタンダード・復元版)
 * ロゴは白バー（上段）、サブリンクは青バー（下段）の二段構成を厳格に死守。
 */
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mainLinks = [
    { label: 'トップ', href: '/' },
    { label: 'イベント', href: '/category/Event' },
    { label: 'インタビュー', href: '/category/Interview' },
    { label: 'スポーツ', href: '/category/Sports' },
    { label: 'コラム', href: '/category/Column' },
    { label: 'オピニオン', href: '/category/Opinion' },
    { label: '紙面ビューアー', href: '/viewer', icon: <FileText size={12} className="text-slate-400" /> },
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

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-md">
      {/* 白バー：ロゴとメインリンク */}
      <div className="w-full border-b bg-white relative">
        <div className="max-w-[1280px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-12 flex-grow">
            {!isSearchOpen && (
              <Link href="/" className="flex items-center group">
                <div className="font-yuji text-2xl md:text-4xl tracking-tighter leading-none whitespace-nowrap text-slate-900 group-hover:text-primary transition-colors">
                  北海学園大学新聞
                </div>
              </Link>
            )}

            {!isSearchOpen && (
              <nav className="hidden xl:flex items-center gap-1">
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2",
                      pathname === link.href ? "bg-slate-100 text-primary" : "text-slate-600 hover:text-primary hover:bg-slate-50"
                    )}
                  >
                    {link.icon && <span>{link.icon}</span>}
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-4">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full max-w-md">
                <Input 
                  autoFocus
                  placeholder="検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full bg-slate-50 h-10 md:h-12 w-[120px] md:w-[200px]"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X size={20} className="text-slate-400" />
                </Button>
              </form>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                  <Search size={20} className="text-slate-400" />
                </Button>
                <div className="xl:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full font-bold">メニュー</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl min-w-[200px]">
                      {mainLinks.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href} className="w-full text-xs font-bold py-3">
                            {link.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 青バー：団体案内 */}
      <div className="w-full bg-primary text-white shadow-inner">
        <div className="max-w-[1280px] mx-auto px-4 h-12 md:h-16 flex items-center overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-6 md:gap-10">
            {subLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[10px] md:text-xs font-black uppercase tracking-[0.1em] whitespace-nowrap text-white/90 hover:text-white transition-colors py-1 border-b-2 border-transparent hover:border-white/30"
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
