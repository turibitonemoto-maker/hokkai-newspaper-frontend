
"use client";

import Link from 'next/link';
import { Newspaper } from 'lucide-react';

/**
 * 権限の概念を完全に排除したシンプルなナビゲーションバー。
 * ロゴのみを表示する構成にリセットしました。
 */
export function Navbar() {
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

        {/* ナビゲーションメニューは現在すべて削除されています */}
        <nav className="flex items-center gap-6">
        </nav>
      </div>
    </header>
  );
}
