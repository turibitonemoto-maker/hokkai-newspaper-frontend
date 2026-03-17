"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, X, ChevronDown, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    { label: '紙面ビューアー', href: '/viewer', icon: <FileText size={12} className="text-white/80" /> },
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
      <div className="w-full border-b bg-white relative">
        <div className="max-w-[1280px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8 flex-grow">
            {!isSearchOpen && (
              <nav className="flex items-center gap-1 md:gap-2 py-2 overflow-hidden">
                <div className="hidden xl:flex items-center gap-1">
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-sm font-bold uppercase tracking-wider px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2",
                        pathname === link.href ? "bg-slate-100 text-primary" : "text-slate-600 hover:text-primary hover:bg-slate-50"
                      )}
                    >
                      {link.icon && <span className="text-primary">{link.icon}</span>}
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="flex xl:hidden items-center gap-0.5">
                  {mainLinks.slice(0, 4).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1",
                        pathname === link.href ? "bg-slate-100 text-primary" : "text-slate-600 hover:text-primary hover:bg-slate-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-0.5">
                        その他 <ChevronDown size={10} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl min-w-[120px]">
                      {mainLinks.slice(4).map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
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
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search size={20} className="text-slate-400" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-primary text-white shadow-inner">
        <div className="max-w-[1280px] mx-auto px-4 h-16 md:h-24 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 md:gap-12 flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="font-yuji text-2xl md:text-5xl tracking-tighter leading-none whitespace-nowrap text-white">
                北海学園大学新聞
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-4 md:gap-8">
              {subLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[10px] md:text-xs font-black uppercase tracking-[0.1em] whitespace-nowrap text-white/90 hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-white/30"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-[10px] font-black uppercase tracking-widest text-white/90 border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                  団体案内 <ChevronDown size={12} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl min-w-[180px]">
                {subLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className="w-full text-xs font-bold py-2">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
