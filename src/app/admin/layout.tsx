
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Newspaper, LayoutDashboard, Home, LogOut, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 権限チェック：特定のドメインまたはメールのみ許可
  const isAuthorized = !!(user && (user.email === 'admin@example.com' || user.email?.endsWith('@hgu.jp')));

  useEffect(() => {
    // 認証チェックが終わり、ログインしていない、または権限がない場合はログイン画面へ
    if (!isUserLoading && (!user || !isAuthorized)) {
      setIsRedirecting(true);
      router.replace('/login');
    }
  }, [user, isUserLoading, isAuthorized, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  // 認証情報の読み込み中、または未承認・遷移中の表示
  if (isUserLoading || !user || !isAuthorized || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="animate-spin text-primary" size={60} strokeWidth={3} />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck size={20} className="text-primary opacity-50" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">
              {isUserLoading ? "Checking Credentials..." : "Redirecting to Security Gate..."}
            </p>
            {!isUserLoading && !user && (
              <Button variant="link" onClick={() => router.push('/login')} className="text-[9px] font-black text-primary p-0 h-auto uppercase tracking-widest">
                If not redirecting, click here
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: LayoutDashboard, href: '/admin' },
    { id: 'new-article', label: '新規記事作成', icon: Newspaper, href: '/admin/new' },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50/50 w-full font-body">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-100 shadow-xl shadow-slate-200/50">
          <SidebarHeader className="p-6 border-b border-slate-50">
            <Link href="/" className="flex items-center gap-3 group overflow-hidden">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground shrink-0 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <div className="group-data-[state=collapsed]:hidden flex flex-col">
                <span className="font-black text-slate-950 leading-none text-sm tracking-tight uppercase italic text-nowrap">北海学園大学新聞</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">ADMIN CONSOLE</span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="rounded-2xl h-14 px-5 font-black text-slate-600 data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-all duration-300"
                  >
                    <Link href={item.href}>
                      <item.icon className={pathname === item.href ? "text-primary" : "text-slate-400"} strokeWidth={pathname === item.href ? 2.5 : 2} />
                      <span className="text-xs uppercase tracking-wider">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-6 border-t border-slate-50">
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="サイトを表示" className="rounded-xl font-bold text-slate-500 h-11">
                  <Link href="/">
                    <Home size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">サイトを表示</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} tooltip="ログアウト" className="rounded-xl font-black text-destructive hover:text-destructive hover:bg-destructive/5 transition-colors h-11">
                  <LogOut size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">ログアウト</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex-grow flex flex-col bg-transparent">
          <header className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center px-8 justify-between shrink-0 sticky top-0 z-30 shadow-sm shadow-slate-100/20">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="text-slate-400 hover:text-primary transition-colors" />
              <div className="h-6 w-px bg-slate-100 hidden sm:block" />
              <h1 className="text-lg font-black tracking-tight text-slate-900 hidden sm:block">
                管理者コンソール
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">{user?.displayName || '新聞会 メンバー'}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{user?.email}</p>
              </div>
              <Avatar className="h-10 w-10 ring-2 ring-primary/10 shadow-lg">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="bg-primary text-white font-black">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-grow p-8 lg:p-12 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
