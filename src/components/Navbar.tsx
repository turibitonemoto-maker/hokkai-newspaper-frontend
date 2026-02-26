
"use client";

import Link from 'next/link';
import { Newspaper, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-white transition-transform group-hover:scale-105">
            <Newspaper size={24} />
          </div>
          <span className="font-black text-xl tracking-tighter">HGU新聞会</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/category/Campus" className="hover:text-primary transition-colors">学内ニュース</Link>
          <Link href="/category/Event" className="hover:text-primary transition-colors">イベント</Link>
          <Link href="/category/Interview" className="hover:text-primary transition-colors">インタビュー</Link>
          <Link href="/category/Sports" className="hover:text-primary transition-colors">スポーツ</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search size={20} />
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
            <Link href="/login">ログイン</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu size={24} />
          </Button>
        </div>
      </div>
    </header>
  );
}
