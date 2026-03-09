
"use client";

import Link from 'next/link';
import { Newspaper, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 権限の概念を完全に排除したナビゲーションバー。
 * 「新聞記事の分類」をナビゲーション内に配置しました。
 */
export function Navbar() {
  const categories = [
    { id: 'Announcements', label: 'お知らせ' },
    { id: 'Campus', label: 'キャンパス' },
    { id: 'Event', label: 'イベント' },
    { id: 'Interview', label: 'インタビュー' },
    { id: 'Sports', label: 'スポーツ' },
    { id: 'Opinion', label: 'オピニオン' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-primary p-1.5 rounded-lg text-white transition-all group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-primary/20">
            <Newspaper size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-950">
            北海学園大学<span className="text-primary">新聞</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-primary transition-colors outline-none">
              新聞記事の分類 <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] shadow-2xl border-none ring-1 ring-slate-100">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.id} asChild>
                  <Link 
                    href={`/category/${cat.id}`}
                    className="flex flex-col items-start px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{cat.label}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{cat.id}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
