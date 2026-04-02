"use client";

import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, X, FileText, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LinkNext from 'next/link';

/**
 * ナビゲーション (常時表示・物理固定版)
 * ブランドカラー：北海→青、大学→青。
 * ロゴ表記を「北海学園大学新聞」に固定。
 */
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mainLinks = [
    { label: 'トップ', href: '/' },
    { label: 'キャンパス', href: '/category/Campus' },
    { label: 'イベント', href: '/category/Event' },
    { label: 'インタビュー', href: '/category/Interview' },
    { label: 'スポーツ', href: '/category/Sports' },
    { label: 'コラム', href: '/category/Column' },
    { label: 'オピニオン', href: '/category/Opinion' },
    { label: '紙面ビューアー', href: '/viewer', icon: <FileText size={12} className="text-slate-400" /> },
  ];

  const subLinks = [
    { label: '北海学園大学新聞会とは', href: '/about' },
    { label: '会長挨拶', href: '/greeting' },
    { label: '部員募集', href: '/recruit' },
    { label: '公式SNS', href: '/social', icon: <Share2 size={12} className="text-white/60" /> },
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
      {/* 白バー：ロゴとメインリンク (常に表示) */}
      <div className="w-full border-b bg-white relative">
        <div className="max-w-[1280px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 md:gap-12 flex-grow overflow-hidden">
            {!isSearchOpen && (
              <LinkNext href="/" className="flex items-center group shrink-0">
                <div className="font-yuji text-xl md:text-3xl tracking-tighter leading-none whitespace-nowrap">
                  <span className="text-primary group-hover:opacity-80 transition-opacity">北海</span>
                  <span className="text-slate-900 group-hover:opacity-80 transition-opacity">学園</span>
                  <span className="text-primary group-hover:opacity-80 transition-opacity">大学</span>
                  <span className="text-slate-900 group-hover:opacity-80 transition-opacity">新聞</span>
                </div>
              </LinkNext>
            )}

            {!isSearchOpen && (
              <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
                {mainLinks.map((link) => (
                  <LinkNext
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 md:px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5",
                      pathname === link.href ? "bg-slate-100 text-primary" : "text-slate-600 hover:text-primary hover:bg-slate-50"
                    )}
                  >
                    {link.icon && <span className="shrink-0">{link.icon}</span>}
                    {link.label}
                  </LinkNext>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <Input 
                  autoFocus
                  placeholder="検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full bg-slate-50 h-10 w-[150px] md:w-[200px]"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X size={20} className="text-slate-400" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search size={20} className="text-slate-400" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 青バー：団体案内 (常に表示) */}
      <div className="w-full bg-primary text-white shadow-inner">
        <div className="max-w-[1280px] mx-auto px-4 h-12 md:h-16 flex items-center overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-6 md:gap-10">
            {subLinks.map((link) => (
              <LinkNext
                key={link.label}
                href={link.href}
                className={cn(
                  "text-[10px] md:text-xs font-black uppercase tracking-[0.1em] whitespace-nowrap text-white/90 hover:text-white transition-colors py-1 border-b-2 flex items-center gap-2",
                  pathname === link.href ? "border-white" : "border-transparent hover:border-white/30"
                )}
              >
                {link.icon && <span>{link.icon}</span>}
                {link.label}
              </LinkNext>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
