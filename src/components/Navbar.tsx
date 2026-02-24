"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Newspaper, LayoutDashboard, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: '最新記事', href: '/' },
    { label: '学内ニュース', href: '/category/Campus' },
    { label: 'イベント', href: '/category/Event' },
    { label: 'インタビュー', href: '/category/Interview' },
    { label: 'スポーツ', href: '/category/Sports' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-primary-foreground group-hover:scale-110 transition-transform">
            <Newspaper size={24} />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight hidden sm:block">
            北海学園大学新聞会
          </span>
          <span className="font-headline font-bold text-lg tracking-tight sm:hidden">
            HGU新聞
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary font-bold" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/admin">
              <LayoutDashboard size={16} />
              管理者
            </Link>
          </Button>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-base font-medium p-2 rounded-md",
                pathname === item.href ? "bg-secondary text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <Link href="/admin" onClick={() => setIsOpen(false)}>
              <LayoutDashboard size={18} />
              管理者ログイン
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
}