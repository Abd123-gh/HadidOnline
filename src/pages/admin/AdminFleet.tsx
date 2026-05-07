import { useEffect, useState } from 'react'
import { Plus, Search, Wifi, Wind, Luggage, Star, CreditCard as Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { supabase, type Vehicle } from '@/lib/supabase'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const statusMap: Record<string, { label: string; class: string }> = {
  available: { label: 'متاح', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  busy: { label: 'مشغول', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  maintenance: { label: 'صيانة', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  out_of_service: { label: 'خارج الخدمة', class: 'bg-slate-100 text-slate-600' },
}

const comfortMap: Record<string, { label: string; stars: number }> = {
  standard: { label: 'قياسي', stars: 3 },
  business: { label: 'أعمال', stars: 4 },
  vip: { label: 'VIP', stars: 5 },
}

const emptyVehicle = {
  name: '', type: 'bus', plate_number: '', capacity: 40,
  model: '', year: new Date().getFullYear(), has_ac: true, has_wifi: false,
  has_luggage_space: true, comfort_level: 'standard', status: 'available', notes: '',
}

export default function AdminFleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filtered, setFiltered] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dialog, setDialog] = useState(false)
  const [form, setForm] = useState<typeof emptyVehicle>({ ...emptyVehicle })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    supabase.from('vehicles').select('*').order('name').then(({ data }) => {
      setVehicles(data ?? [])
      setFiltered(data ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = vehicles
    if (statusFilter !== 'all') result = result.filter(v => v.status === statusFilter)
    if (search) result = result.filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.plate_number.includes(search)
    )
    setFiltered(result)
  }, [statusFilter, search, vehicles])

  const openAdd = () => { setForm({ ...emptyVehicle }); setEditId(null); setDialog(true) }
  const openEdit = (v: Vehicle) => {
    setForm({
      name: v.name, type: v.type, plate_number: v.plate_number,
      capacity: v.capacity, model: v.model ?? '', year: v.year ?? new Date().getFullYear(),
      has_ac: v.has_ac, has_wifi: v.has_wifi, has_luggage_space: v.has_luggage_space,
      comfort_level: v.comfort_level, status: v.status, notes: v.notes ?? '',
    })
    setEditId(v.id)
    setDialog(true)
  }

  const save = async () => {
    if (!form.name || !form.plate_number) { toast.error('يرجى ملء الحقول المطلوبة'); return }
    setSaving(true)
    const payload = {
      name: form.name, type: form.type as Vehicle['type'],
      plate_number: form.plate_number, capacity: Number(form.capacity),
      model: form.model || null, year: Number(form.year),
      has_ac: form.has_ac, has_wifi: form.has_wifi, has_luggage_space: form.has_luggage_space,
      comfort_level: form.comfort_level as Vehicle['comfort_level'],
      status: form.status as Vehicle['status'], notes: form.notes || null,
    }
    const { error } = editId
      ? await supabase.from('vehicles').update(payload).eq('id', editId)
      : await supabase.from('vehicles').insert(payload)
    setSaving(false)
    if (error) { toast.error('حدث خطأ: ' + error.message); return }
    toast.success(editId ? 'تم تحديث المركبة' : 'تم إضافة المركبة')
    setDialog(false)
    load()
  }

  const deleteVehicle = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المركبة؟')) return
    const { error } = await supabase.from('vehicles').delete().eq('id', id)
    if (error) { toast.error('فشل الحذف'); return }
    toast.success('تم حذف المركبة')
    load()
  }

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const fleetStats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    busy: vehicles.filter(v => v.status === 'busy').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Cairo' }}>إدارة الأسطول</h1>
          <p className="text-sm text-muted-foreground mt-1">{vehicles.length} مركبة في الأسطول</p>
        </div>
        <Button onClick={openAdd} className="gap-2 font-semibold">
          <Plus className="size-4" />إضافة مركبة
        </Button>
      </div>

      {/* Fleet stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي', value: fleetStats.total, color: 'text-foreground', bg: 'bg-muted/50' },
          { label: 'متاحة', value: fleetStats.available, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'مشغولة', value: fleetStats.busy, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'صيانة', value: fleetStats.maintenance, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
        ].map(s => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-4 text-center">
              <div className={`text-3xl font-black mb-1 ${s.color}`} style={{ fontFamily: 'Cairo' }}>{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="بحث باسم المركبة أو رقم اللوحة..." className="pr-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {Object.entries(statusMap).map(([v, s]) => (
              <SelectItem key={v} value={v}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(v => {
            const status = statusMap[v.status]
            const comfort = comfortMap[v.comfort_level]
            return (
              <Card key={v.id} className="border-border/60 overflow-hidden group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-foreground text-base">{v.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.model} {v.year} · {v.plate_number}</p>
                    </div>
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', status.class)}>
                      {status.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-2xl font-black text-foreground" style={{ fontFamily: 'Cairo' }}>
                      {v.capacity}
                    </div>
                    <div className="text-xs text-muted-foreground">راكب</div>
                    <div className="mr-auto flex gap-0.5">
                      {Array.from({ length: comfort.stars }).map((_, i) => (
                        <Star key={i} className="size-3 text-accent fill-accent" />
                      ))}
                      <span className="text-xs text-muted-foreground mr-1">{comfort.label}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4">
                    {v.has_ac && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Wind className="size-3.5 text-blue-500" />تكييف</div>}
                    {v.has_wifi && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Wifi className="size-3.5 text-emerald-500" />واي فاي</div>}
                    {v.has_luggage_space && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Luggage className="size-3.5 text-amber-500" />أمتعة</div>}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5 h-8" onClick={() => openEdit(v)}>
                      <Edit className="size-3.5" />تعديل
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteVehicle(v.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-black text-right">
              {editId ? 'تعديل المركبة' : 'إضافة مركبة جديدة'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>اسم المركبة *</Label>
              <Input placeholder="حافلة VIP الذهبية" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>النوع</Label>
              <Select value={form.type} onValueChange={v => set('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bus">حافلة</SelectItem>
                  <SelectItem value="van">فان</SelectItem>
                  <SelectItem value="minibus">مينيباس</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>رقم اللوحة *</Label>
              <Input placeholder="ح أ ب 1234" value={form.plate_number} onChange={e => set('plate_number', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>السعة (راكب)</Label>
              <Input type="number" min="1" max="80" value={form.capacity} onChange={e => set('capacity', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>الموديل</Label>
              <Input placeholder="Mercedes Tourismo" value={form.model} onChange={e => set('model', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>درجة الراحة</Label>
              <Select value={form.comfort_level} onValueChange={v => set('comfort_level', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">قياسي</SelectItem>
                  <SelectItem value="business">أعمال</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(statusMap).map(([v, s]) => (
                    <SelectItem key={v} value={v}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 grid grid-cols-3 gap-3 py-2">
              {[
                { key: 'has_ac', label: 'تكييف' },
                { key: 'has_wifi', label: 'واي فاي' },
                { key: 'has_luggage_space', label: 'أمتعة' },
              ].map(item => (
                <div key={item.key} className="flex items-center gap-2">
                  <Switch
                    checked={form[item.key as keyof typeof form] as boolean}
                    onCheckedChange={v => set(item.key, v)}
                  />
                  <Label className="text-sm cursor-pointer">{item.label}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>إلغاء</Button>
            <Button onClick={save} disabled={saving} className="gap-2">
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إضافة المركبة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
