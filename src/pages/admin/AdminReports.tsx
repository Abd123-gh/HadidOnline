import { useEffect, useState } from 'react'
import { TrendingUp, Users, Truck, FileText, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiDb } from '@/lib/api'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig
} from '@/components/ui/chart'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

const chartConfig: ChartConfig = {
  bookings: { label: 'الحجوزات', color: 'var(--color-chart-1)' },
  revenue: { label: 'الإيرادات', color: 'var(--color-chart-2)' },
  trips: { label: 'الرحلات', color: 'var(--color-chart-3)' },
}

const monthlyData = [
  { month: 'يناير', bookings: 12, revenue: 28000, trips: 15 },
  { month: 'فبراير', bookings: 18, revenue: 35000, trips: 21 },
  { month: 'مارس', bookings: 25, revenue: 52000, trips: 28 },
  { month: 'أبريل', bookings: 22, revenue: 48000, trips: 25 },
  { month: 'مايو', bookings: 30, revenue: 62000, trips: 34 },
  { month: 'يونيو', bookings: 28, revenue: 58000, trips: 31 },
]

const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)']

export default function AdminReports() {
  const [period, setPeriod] = useState('6months')
  const [counts, setCounts] = useState({ bookings: 0, vehicles: 0, clients: 0, contracts: 0 })
  const [tripTypes] = useState([
    { name: 'سياحية', value: 35 },
    { name: 'شركة', value: 40 },
    { name: 'مدرسة', value: 15 },
    { name: 'خاصة', value: 10 },
  ])

  useEffect(() => {
    Promise.all([
      apiDb.from('bookings').select('id', { count: 'exact', head: true }),
      apiDb.from('vehicles').select('id', { count: 'exact', head: true }),
      apiDb.from('clients').select('id', { count: 'exact', head: true }),
      apiDb.from('contracts').select('id', { count: 'exact', head: true }),
    ]).then(([b, v, c, co]) => {
      setCounts({
        bookings: b.count ?? 0,
        vehicles: v.count ?? 0,
        clients: c.count ?? 0,
        contracts: co.count ?? 0,
      })
    })
  }, [])

  const kpis = [
    { icon: Calendar, label: 'إجمالي الحجوزات', value: counts.bookings, sub: '+12% عن الشهر السابق', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { icon: Users, label: 'إجمالي العملاء', value: counts.clients, sub: '+5 عملاء جدد', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { icon: Truck, label: 'المركبات النشطة', value: counts.vehicles, sub: 'الأسطول الحالي', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { icon: FileText, label: 'العقود النشطة', value: counts.contracts, sub: '3 قيد التجديد', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Cairo' }}>التقارير والإحصاءات</h1>
          <p className="text-sm text-muted-foreground mt-1">تحليل شامل لأداء المنصة</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">آخر شهر</SelectItem>
            <SelectItem value="3months">آخر 3 أشهر</SelectItem>
            <SelectItem value="6months">آخر 6 أشهر</SelectItem>
            <SelectItem value="1year">السنة الكاملة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`size-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`size-5 ${kpi.color}`} />
                </div>
                <TrendingUp className="size-4 text-emerald-500" />
              </div>
              <div className={`text-2xl font-black mb-1 ${kpi.color}`} style={{ fontFamily: 'Cairo' }}>{kpi.value}</div>
              <div className="text-sm font-medium text-foreground">{kpi.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{kpi.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Bookings Bar Chart */}
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
                <Bar dataKey="bookings" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} name="الحجوزات" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Trip Type Pie Chart */}
        <Card className="border-border/60">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-bold">توزيع أنواع الرحلات</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={chartConfig} className="min-h-[220px]">
              <PieChart>
                <Pie
                  data={tripTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {tripTypes.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ChartContainer>
            <div className="mt-3 space-y-2">
              {tripTypes.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Line Chart */}
      <Card className="border-border/60">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-base font-bold">الإيرادات الشهرية (ر.س)</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartContainer config={chartConfig} className="min-h-[200px]">
            <LineChart data={monthlyData} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fontFamily: 'Cairo' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(v) => [`${Number(v).toLocaleString()} ر.س`, 'الإيرادات']} />
              <Line
                dataKey="revenue"
                type="monotone"
                stroke="var(--color-chart-2)"
                strokeWidth={2.5}
                dot={{ fill: 'var(--color-chart-2)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card className="border-border/60">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-base font-bold">ملخص الأداء الشهري</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">الشهر</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">الحجوزات</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">الرحلات</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">الإيرادات (ر.س)</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">معدل الإنجاز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {monthlyData.map(row => (
                  <tr key={row.month} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium">{row.month}</td>
                    <td className="px-5 py-3 text-muted-foreground">{row.bookings}</td>
                    <td className="px-5 py-3 text-muted-foreground">{row.trips}</td>
                    <td className="px-5 py-3 font-semibold">{row.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${Math.round((row.trips / row.bookings) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-left">
                          {Math.round((row.trips / row.bookings) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
