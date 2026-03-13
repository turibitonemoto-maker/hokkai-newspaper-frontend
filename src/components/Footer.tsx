"use client";

/**
 * 画面の端から端まで広がる黒いフッター。
 * 管理者向けのログイン・ログアウト機能を完全に削除し、表示専用にしました。
 */
export function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-600 py-12 md:py-20 text-center border-t border-slate-900 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-8 md:mb-12 opacity-50">
          <div className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">
            <span className="text-primary">北海</span>
            <span className="text-white">学園</span>
            <span className="text-primary">大学</span>
            <span className="text-white">新聞</span>
          </div>
        </div>

        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-500">
          &copy; {new Date().getFullYear()} 北海学園大学一部新聞会 / REPORTING FOR THE FUTURE
        </p>
      </div>
    </footer>
  );
}
