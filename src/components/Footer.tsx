"use client";

/**
 * 画面の端から端まで広がる黒いフッター。
 * コンテンツは中央1280pxに整列。
 * 団体名を「北海学園大学一部新聞会」に変更。
 */
export function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-600 py-12 md:py-16 text-center border-t border-slate-900 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-6 md:mb-8 opacity-50">
          <div className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">
            <span className="text-primary">北海</span>
            <span className="text-white">学園</span>
            <span className="text-primary">大学</span>
            <span className="text-white">一部</span>
            <span className="text-primary">新聞</span>
            <span className="text-white">会</span>
          </div>
        </div>
        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
          &copy; {new Date().getFullYear()} 北海学園大学一部新聞会 / REPORTING FOR THE FUTURE
        </p>
      </div>
    </footer>
  );
}
