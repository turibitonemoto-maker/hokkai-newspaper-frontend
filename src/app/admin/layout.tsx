"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Newspaper, LayoutDashboard, FileText, Settings, LogOut, Home, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { label: 'ダッシュボード', icon: LayoutDashboard, href: '/admin' },
    { label: '記事管理', icon: FileText, href: '/admin' },
    { label: '新規記事作成', icon: Newspaper, href: '/admin/new' },
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
              <span className="font-bold truncate group-data-[state=collapsed]:hidden">北海学園大学新聞 管理</span>
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
                <SidebarMenuButton onClick={handleSignOut} tooltip="ログアウト" className="text-destructive hover:text-destructive">
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
                <p className="font-medium text-primary">新聞会 メンバー</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-primary font-bold">
                {user.email?.charAt(0).toUpperCase()}
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
