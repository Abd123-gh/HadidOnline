import { useEffect, useState } from 'react'
import { Search, MapPin, Clock, CircleCheck as CheckCircle2, Circle as XCircle, Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { apiDb } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Trip = {
  id: string
  booking_id?: string
  vehicle_id?: string
  driver_id?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  pickup_location: string
  destination: string
  scheduled_date: string
  scheduled_time: string
  actual_start?: string
  actual_end?: string
  notes?: string
  created_at: string
}

const statusMap: Record<string, { label: string; class: string }> = {
  scheduled: { label: 'مجدولة', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  in_progress: { label: 'جارية', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  completed: { label: 'مكتملة', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  cancelled: { label: 'ملغاة', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

export default function AdminTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [filtered, setFiltered] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Trip | null>(null)
  const [updating, setUpdating] = useState(false)

  const load = () => {
    setLoading(true)
    apiDb.from('trips').select('*').order('scheduled_date', { ascending: false }).then(({ data }) => {
      setTrips((data as Trip[]) ?? [])
      setFiltered((data as Trip[]) ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = trips
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter)
    if (search) result = result.filter(t =>
      t.pickup_location.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [statusFilter, search, trips])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true)
    const updates: Record<string, unknown> = { status }
    if (status === 'in_progress') updates.actual_start = new Date().toISOString()
    if (status === 'completed') updates.actual_end = new Date().toISOString()
    const { error } = await apiDb.from('trips').update(updates).eq('id', id)
    setUpdating(false)
    if (error) { toast.error('فشل التحديث'); return }
    toast.success('تم تحديث حالة الرحلة')
    setSelected(null)
    load()
  }

  const stats = {
    scheduled: trips.filter(t => t.status === 'scheduled').length,
    in_progress: trips.filter(t => t.status === 'in_progress').length,
    completed: trips.filter(t => t.status === 'completed').length,
    total: trips.length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'Cairo' }}>إدارة الرحلات</h1>
        <p className="text-sm text-muted-foreground mt-1">متابعة وإدارة جميع الرحلات</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي', value: stats.total, color: 'text-foreground' },
          { label: 'مجدولة', value: stats.scheduled, color: 'text-blue-600' },
          { label: 'جارية', value: stats.in_progress, color: 'text-amber-600' },
          { label: 'مكتملة', value: stats.completed, color: 'text-emerald-600' },
        ].map(s => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-4 text-center">
              <div className={`text-3xl font-black mb-1 ${s.color}`} style={{ fontFamily: 'Cairo' }}>{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="بحث بالموقع أو الوجهة..." className="pr-9" value={search} onChange={e => setSearch(e.target.value)} />
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

      <Card className="border-border/60">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-base font-bold">{filtered.length} رحلة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              جاري التحميل...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">لا توجد رحلات</div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(trip => {
                const status = statusMap[trip.status]
                return (
                  <div key={trip.id} className="px-5 py-4 hover:bg-muted/20 transition-colors flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-sm text-foreground">{trip.pickup_location}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">→ {trip.destination}</div>
                        </div>
                        <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold shrink-0', status.class)}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {trip.scheduled_date} {trip.scheduled_time}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs shrink-0" onClick={() => setSelected(trip)}>
                      إدارة
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-black text-right">إدارة الرحلة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary shrink-0" />
                  <span className="font-semibold">{selected.pickup_location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-4 shrink-0 text-center">→</span>
                  <span>{selected.destination}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs text-muted-foreground">التاريخ</Label><p className="font-semibold mt-1">{selected.scheduled_date}</p></div>
                <div><Label className="text-xs text-muted-foreground">الوقت</Label><p className="font-semibold mt-1">{selected.scheduled_time}</p></div>
                <div><Label className="text-xs text-muted-foreground">الحالة</Label>
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold mt-1 inline-block', statusMap[selected.status].class)}>
                    {statusMap[selected.status].label}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              {selected.status === 'scheduled' && (
                <Button size="sm" className="gap-1.5" onClick={() => updateStatus(selected.id, 'in_progress')} disabled={updating}>
                  <Play className="size-3.5" />بدء الرحلة
                </Button>
              )}
              {selected.status === 'in_progress' && (
                <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700" onClick={() => updateStatus(selected.id, 'completed')} disabled={updating}>
                  <CheckCircle2 className="size-3.5" />إنهاء الرحلة
                </Button>
              )}
              {['scheduled', 'in_progress'].includes(selected.status) && (
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
