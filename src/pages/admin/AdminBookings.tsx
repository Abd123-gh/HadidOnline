import { useEffect, useState } from 'react'
import { Search, Eye, CircleCheck as CheckCircle2, Circle as XCircle, Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { supabase, type Booking } from '@/lib/supabase'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const statusMap: Record<string, { label: string; class: string }> = {
  new: { label: 'جديد', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  confirmed: { label: 'مؤكد', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  assigned: { label: 'معين', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  in_progress: { label: 'جارٍ', class: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400' },
  completed: { label: 'مكتمل', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  cancelled: { label: 'ملغي', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

const typeMap: Record<string, string> = {
  tourist: 'سياحية', corporate: 'شركة', school: 'مدرسة', private: 'خاصة'
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filtered, setFiltered] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Booking | null>(null)
  const [updating, setUpdating] = useState(false)

  const load = () => {
    setLoading(true)
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setBookings(data ?? [])
      setFiltered(data ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = bookings
    if (statusFilter !== 'all') result = result.filter(b => b.status === statusFilter)
    if (search) result = result.filter(b =>
      b.client_name.toLowerCase().includes(search.toLowerCase()) ||
      b.client_phone.includes(search) ||
      b.booking_number?.includes(search)
    )
    setFiltered(result)
  }, [statusFilter, search, bookings])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true)
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    setUpdating(false)
    if (error) { toast.error('فشل التحديث'); return }
    toast.success('تم تحديث الحالة')
    load()
    setSelected(null)
  }

  const statusCounts = {
    new: bookings.filter(b => b.status === 'new').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Cairo' }}>الحجوزات</h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة جميع طلبات الحجز</p>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'جديدة', count: statusCounts.new, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'مؤكدة', count: statusCounts.confirmed, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'جارية', count: statusCounts.in_progress, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-950/30' },
        ].map(s => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`size-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <span className={`text-lg font-black ${s.color}`}>{s.count}</span>
              </div>
              <span className="text-sm font-medium">{s.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="بحث بالاسم أو الهاتف أو الرقم..." className="pr-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {Object.entries(statusMap).map(([v, s]) => (
              <SelectItem key={v} value={v}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-border/60">
        <CardHeader className="border-b border-border pb-4 flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">
            {filtered.length} حجز
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              جاري التحميل...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">لا توجد حجوزات</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">رقم الحجز</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">العميل</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">النوع</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">التاريخ</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">الرحلة</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">الحالة</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(booking => {
                    const status = statusMap[booking.status]
                    return (
                      <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-muted-foreground">{booking.booking_number}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-foreground">{booking.client_name}</div>
                          <div className="text-xs text-muted-foreground" dir="ltr">{booking.client_phone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="outline" className="text-xs">{typeMap[booking.trip_type]}</Badge>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground text-xs">{booking.trip_date}</td>
                        <td className="px-5 py-4">
                          <div className="text-xs text-foreground">{booking.pickup_location}</div>
                          <div className="text-xs text-muted-foreground">→ {booking.destination}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', status.class)}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 gap-1.5 text-xs"
                            onClick={() => setSelected(booking)}
                          >
                            <Eye className="size-3.5" />
                            عرض
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-black text-right">
                تفاصيل الحجز — {selected.booking_number}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">العميل</Label><p className="font-semibold mt-1">{selected.client_name}</p></div>
                <div><Label className="text-xs text-muted-foreground">الجوال</Label><p className="font-semibold mt-1" dir="ltr">{selected.client_phone}</p></div>
                <div><Label className="text-xs text-muted-foreground">نوع الرحلة</Label><p className="font-semibold mt-1">{typeMap[selected.trip_type]}</p></div>
                <div><Label className="text-xs text-muted-foreground">التاريخ</Label><p className="font-semibold mt-1">{selected.trip_date} {selected.trip_time}</p></div>
                <div><Label className="text-xs text-muted-foreground">الانطلاق</Label><p className="font-semibold mt-1">{selected.pickup_location}</p></div>
                <div><Label className="text-xs text-muted-foreground">الوجهة</Label><p className="font-semibold mt-1">{selected.destination}</p></div>
                <div><Label className="text-xs text-muted-foreground">الركاب</Label><p className="font-semibold mt-1">{selected.passengers}</p></div>
                <div><Label className="text-xs text-muted-foreground">الحالة</Label>
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold mt-1 inline-block', statusMap[selected.status].class)}>
                    {statusMap[selected.status].label}
                  </span>
                </div>
              </div>
              {selected.notes && (
                <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                  <strong>ملاحظات: </strong>{selected.notes}
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              {selected.status === 'new' && (
                <Button size="sm" className="gap-1.5" onClick={() => updateStatus(selected.id, 'confirmed')} disabled={updating}>
                  <CheckCircle2 className="size-3.5" />تأكيد
                </Button>
              )}
              {selected.status === 'confirmed' && (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => updateStatus(selected.id, 'assigned')} disabled={updating}>
                  <Truck className="size-3.5" />تعيين مركبة
                </Button>
              )}
              {['new', 'confirmed'].includes(selected.status) && (
                <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => updateStatus(selected.id, 'cancelled')} disabled={updating}>
                  <XCircle className="size-3.5" />إلغاء
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
