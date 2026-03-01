"use client";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Newspaper, LayoutDashboard, Home, LogOut, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { id: 'admin-dash', label: 'ダッシュボード', icon: LayoutDashboard, href: '/admin' },
    { id: 'admin-new', label: '新規記事作成', icon: Newspaper, href: '/admin/new' },
    { id: 'admin-hero', label: 'ヒーロー画像', icon: ImageIcon, href: '/admin/hero' },
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
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex-grow flex flex-col bg-transparent">
          <header className="h-16 md:h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center px-4 md:px-8 justify-between shrink-0 sticky top-0 z-30 shadow-sm shadow-slate-100/20">
            <div className="flex items-center gap-2 md:gap-6">
              <SidebarTrigger className="text-slate-400 hover:text-primary transition-colors" />
              <div className="h-6 w-px bg-slate-100 hidden md:block" />
              <h1 className="text-sm md:text-lg font-black tracking-tight text-slate-900 truncate max-w-[150px] md:max-w-none">
                管理者コンソール（認証オフ）
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">新聞会 取材班</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Public Access Mode</p>
              </div>
              <Avatar className="h-8 w-8 md:h-10 md:w-10 ring-2 ring-primary/10 shadow-lg">
                <AvatarFallback className="bg-primary text-white font-black text-xs">
                  ADM
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-grow p-4 md:p-8 lg:p-12 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}