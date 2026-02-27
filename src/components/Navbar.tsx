"use client";

import Link from 'next/link';
import { Newspaper, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const navLinks = [
    { href: "/", label: "TOP" },
    { href: "/category/Campus", label: "Campus" },
    { href: "/category/Event", label: "Events" },
    { href: "/category/Interview", label: "Interviews" },
    { href: "/category/Sports", label: "Sports" },
    { href: "/category/Opinion", label: "Opinion" },
  ];

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

        {/* デスクトップ用ナビゲーション */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary hover:bg-primary/5 rounded-full">
            <Search size={20} />
          </Button>
          
          {/* モバイル用ナビゲーション（蛇腹バー） */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-slate-600 hover:bg-slate-50 rounded-xl">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-[40px] border-none shadow-2xl p-0">
              <div className="flex flex-col h-full bg-white">
                <SheetHeader className="p-8 border-b border-slate-50 shrink-0">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg text-white">
                      <Newspaper size={20} />
                    </div>
                    <span className="font-black text-xl tracking-tighter">メニュー</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 p-4 overflow-y-auto grow">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className="flex items-center h-16 px-6 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-600 hover:bg-primary/5 hover:text-primary transition-all active:scale-95"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-8 pt-8 border-t border-slate-50">
                    <Link 
                      href="/login" 
                      className="flex items-center h-16 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      Admin Login
                    </Link>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
