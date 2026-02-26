
"use client";

import Link from 'next/link';
import { Newspaper, Menu, Search, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-white transition-all group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-primary/20">
            <Newspaper size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-950">
            北海学園大学<span className="text-primary">新聞</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">
          <Link href="/" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">TOP</Link>
          <Link href="/category/Campus" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">Campus</Link>
          <Link href="/category/Event" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">Events</Link>
          <Link href="/category/Interview" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">Interviews</Link>
          <Link href="/category/Sports" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">Sports</Link>
          <Link href="/category/Opinion" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1 text-primary/80">Opinion</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-500 hover:text-primary hover:bg-primary/5 rounded-full">
            <Search size={20} />
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-slate-200 font-bold px-6 text-xs h-9" asChild>
            <Link href="/login">
              <UserCircle size={16} className="mr-2" />
              LOGIN
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-slate-600">
            <Menu size={24} />
          </Button>
        </div>
      </div>
    </header>
  );
}
