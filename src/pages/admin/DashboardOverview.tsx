import { useEffect, useState } from 'react'
import { Calendar, FileText, Truck, Users, TrendingUp, TriangleAlert as AlertTriangle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiDb } from '@/lib/api'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const chartConfig: ChartConfig = {
  bookings: { label: 'الحجوزات', color: 'var(--color-chart-1)' },
  revenue: { label: 'الإيرادات', color: 'var(--color-chart-2)' },
}

const monthlyData = [
  { month: 'يناير', bookings: 12, revenue: 28 },
  { month: 'فبراير', bookings: 18, revenue: 35 },
  { month: 'مارس', bookings: 25, revenue: 52 },
  { month: 'أبريل', bookings: 22, revenue: 48 },
  { month: 'مايو', bookings: 30, revenue: 62 },
  { month: 'يونيو', bookings: 28, revenue: 58 },
]

const recentBookings = [
  { id: 'BK-2026-001', client: 'أحمد الشمري', type: 'سياحية', date: '2026-05-08', status: 'confirmed' },
  { id: 'BK-2026-002', client: 'شركة أرامكو', type: 'شركة', date: '2026-05-07', status: 'assigned' },
  { id: 'BK-2026-003', client: 'مدرسة الفيصل', type: 'مدرسة', date: '2026-05-06', status: 'in_progress' },
  { id: 'BK-2026-004', client: 'سارة العمري', type: 'خاصة', date: '2026-05-06', status: 'new' },
  { id: 'BK-2026-005', client: 'خالد الزهراني', type: 'سياحية', date: '2026-05-05', status: 'completed' },
]

const statusMap: Record<string, { label: string; class: string }> = {
  new: { label: 'جديد', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  confirmed: { label: 'مؤكد', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  assigned: { label: 'معين', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  in_progress: { label: 'جارٍ', class: 'bg-brand-blue/10 text-brand-blue' },
  completed: { label: 'مكتمل', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  cancelled: { label: 'ملغي', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

export default function DashboardOverview() {
  const [counts, setCounts] = useState({ bookings: 0, contracts: 0, vehicles: 0, clients: 0 })
  const [vehicleStatus, setVehicleStatus] = useState({ available: 0, busy: 0, maintenance: 0 })

  useEffect(() => {
    Promise.all([
      apiDb.from('bookings').select('id', { count: 'exact', head: true }),
      apiDb.from('contracts').select('id', { count: 'exact', head: true }),
      apiDb.from('vehicles').select('id,status'),
      apiDb.from('clients').select('id', { count: 'exact', head: true }),
    ]).then(([bookings, contracts, vehicles, clients]) => {
      const vData = vehicles.data ?? []
      setCounts({
        bookings: bookings.count ?? 0,
        contracts: contracts.count ?? 0,
        vehicles: vData.length,
        clients: clients.count ?? 0,
      })
      setVehicleStatus({
        available: vData.filter(v => v.status === 'available').length,
        busy: vData.filter(v => v.status === 'busy').length,
        maintenance: vData.filter(v => v.status === 'maintenance').length,
      })
    })
  }, [])

  const statCards = [
    { icon: Calendar, label: 'إجمالي الحجوزات', value: counts.bookings, sub: '+5 هذا الأسبوع', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { icon: FileText, label: 'العقود النشطة', value: counts.contracts, sub: '3 قيد التجديد', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { icon: Truck, label: 'المركبات', value: counts.vehicles, sub: `${vehicleStatus.available} متاح`, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { icon: Users, label: 'العملاء', value: counts.clients, sub: '+2 هذا الشهر', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground" style={{ fontFamily: 'Cairo' }}>لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground mt-1">مرحباً، هذا ملخص عمليات اليوم</p>
        </div>
        <Link to="/booking">
          <Button className="gap-2 font-semibold" style={{ background: 'oklch(0.77 0.15 80)', color: '#0F172A' }}>
            <Calendar className="size-4" />
            حجز جديد
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <Card key={card.label} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`size-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`size-5 ${card.color}`} />
                </div>
                <TrendingUp className="size-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: 'Cairo' }}>
                {card.value}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">{card.label}</div>
              <div className="text-xs text-muted-foreground">{card.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-bold">الحجوزات الشهرية</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={chartConfig} className="min-h-[220px]">
              <BarChart data={monthlyData} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fontFamily: 'Cairo' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="bookings" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Fleet Status */}
        <Card className="border-border/60">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-bold">حالة الأسطول</CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {[
              { label: 'متاحة', count: vehicleStatus.available, color: 'bg-emerald-500', textColor: 'text-emerald-600', total: counts.vehicles },
              { label: 'مشغولة', count: vehicleStatus.busy, color: 'bg-amber-500', textColor: 'text-amber-600', total: counts.vehicles },
              { label: 'صيانة', count: vehicleStatus.maintenance, color: 'bg-red-500', textColor: 'text-red-600', total: counts.vehicles },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className={`text-sm font-bold ${item.textColor}`}>{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all`}
                    style={{ width: counts.vehicles ? `${(item.count / counts.vehicles) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3">
                <AlertTriangle className="size-4 shrink-0" />
                <span className="text-xs font-medium">مركبة في الصيانة</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="border-border/60">
        <CardHeader className="border-b border-border pb-4 flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">آخر الحجوزات</CardTitle>
          <Link to="/admin/bookings">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-medium">
              عرض الكل
              <ArrowLeft className="size-3.5 rtl:rotate-180" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentBookings.map(booking => {
              const status = statusMap[booking.status]
              return (
                <div key={booking.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold text-sm">
                      {booking.client[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{booking.client}</div>
                      <div className="text-xs text-muted-foreground">{booking.id} · {booking.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="text-xs text-muted-foreground hidden md:block">{booking.date}</div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.class}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'حجز جديد', href: '/admin/bookings', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { icon: FileText, label: 'عقد جديد', href: '/admin/contracts', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { icon: Truck, label: 'إضافة مركبة', href: '/admin/fleet', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { icon: Users, label: 'عميل جديد', href: '/admin/clients', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30' },
        ].map(a => (
          <Link key={a.label} to={a.href}>
            <Card className="card-hover cursor-pointer border-border/60 hover:border-primary/30">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`size-9 rounded-lg ${a.bg} flex items-center justify-center`}>
                  <a.icon className={`size-5 ${a.color}`} />
                </div>
                <span className="text-sm font-semibold">{a.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
