import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, FileText, Truck, Users, MapPin, UserCheck, Receipt, ChartBar as BarChart3, Settings, Bell, Search, LogOut, Moon, Sun, ExternalLink, ChevronDown } from 'lucide-react'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, SidebarInset, SidebarSeparator
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from '@/components/theme-provider'
import Logo from '@/components/shared/Logo'

const menuGroups = [
  {
    label: 'الرئيسي',
    items: [
      { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
    ]
  },
  {
    label: 'العمليات',
    items: [
      { href: '/admin/bookings', label: 'الحجوزات', icon: Calendar, badge: '5' },
      { href: '/admin/contracts', label: 'العقود', icon: FileText },
      { href: '/admin/trips', label: 'الرحلات والمسارات', icon: MapPin },
    ]
  },
  {
    label: 'الموارد',
    items: [
      { href: '/admin/fleet', label: 'إدارة الأسطول', icon: Truck },
      { href: '/admin/drivers', label: 'السائقون', icon: UserCheck },
      { href: '/admin/clients', label: 'العملاء', icon: Users },
    ]
  },
  {
    label: 'المالية',
    items: [
      { href: '/admin/invoices', label: 'الفواتير', icon: Receipt },
      { href: '/admin/reports', label: 'التقارير', icon: BarChart3 },
    ]
  },
  {
    label: 'النظام',
    items: [
      { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
    ]
  }
]

export default function AdminLayout() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const isActive = (href: string) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname === href

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-muted/30">
        <Sidebar side="right" collapsible="icon" variant="sidebar">
          <SidebarHeader className="h-16 border-b border-sidebar-border">
            <div className="flex items-center justify-between px-2 h-full">
              <Logo size="sm" variant="light" />
            </div>
          </SidebarHeader>

          <SidebarContent>
            {menuGroups.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.href)}
                          tooltip={item.label}
                          size="default"
                        >
                          <Link to={item.href} className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <item.icon />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <Badge
                                className="text-xs px-1.5 py-0 h-5 shrink-0"
                                style={{ background: 'oklch(0.77 0.15 80)', color: '#0F172A' }}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarSeparator />

          <SidebarFooter className="p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/" target="_blank">
                  <SidebarMenuButton tooltip="عرض الموقع" size="sm">
                    <ExternalLink />
                    <span>عرض الموقع</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Admin User */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors mt-1">
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="text-xs font-bold bg-accent text-accent-foreground">
                      م
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-right overflow-hidden">
                    <div className="text-xs font-semibold text-sidebar-foreground truncate">المدير العام</div>
                    <div className="text-xs text-sidebar-foreground/60 truncate">admin@hadid.sa</div>
                  </div>
                  <ChevronDown className="size-3.5 text-sidebar-foreground/60 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-56">
                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? <Sun className="size-4 ml-2" /> : <Moon className="size-4 ml-2" />}
                  {theme === 'dark' ? 'الوضع الفاتح' : 'الوضع المظلم'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')} className="text-destructive">
                  <LogOut className="size-4 ml-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1 overflow-auto">
          {/* Top bar */}
          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border h-16 flex items-center px-6 gap-4">
            <SidebarTrigger className="-mr-1" />

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                className="pr-9 h-9 bg-secondary border-0 focus-visible:ring-1"
              />
            </div>

            <div className="flex items-center gap-2 mr-auto">
              <Button variant="ghost" size="icon" className="relative size-9">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
              </Button>
            </div>
          </header>

          {/* Page content */}
          <div className="p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
      <Toaster position="bottom-left" richColors />
    </SidebarProvider>
  )
}
