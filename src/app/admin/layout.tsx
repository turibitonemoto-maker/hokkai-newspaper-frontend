"use client";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Newspaper, LayoutDashboard, FileText, Settings, LogOut, Home, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'ダッシュボード', icon: LayoutDashboard, href: '/admin' },
    { label: '記事一覧', icon: FileText, href: '/admin/articles' },
    { label: '新規記事作成', icon: Newspaper, href: '/admin/new' },
    { label: 'メンバー管理', icon: Users, href: '/admin/members' },
    { label: '設定', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/30 w-full">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="p-4 border-b">
            <Link href="/" className="flex items-center gap-2 group overflow-hidden">
              <div className="bg-primary p-1.5 rounded-lg text-primary-foreground shrink-0">
                <Newspaper size={20} />
              </div>
              <span className="font-bold truncate group-data-[state=collapsed]:hidden">HGU新聞 管理</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="サイトを表示">
                  <Link href="/">
                    <Home />
                    <span>サイトを表示</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="ログアウト" className="text-destructive hover:text-destructive">
                  <LogOut />
                  <span>ログアウト</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex-grow flex flex-col">
          <header className="h-16 border-b bg-white flex items-center px-6 justify-between shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-lg font-bold">管理者コンソール</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-right hidden sm:block">
                <p className="font-medium text-primary">新聞会 管理者</p>
                <p className="text-xs text-muted-foreground">admin@hgu-shimbun.jp</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-primary font-bold">
                A
              </div>
            </div>
          </header>
          <div className="flex-grow p-6 lg:p-10 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}