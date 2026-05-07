import { useEffect, useState } from 'react'
import { Plus, Search, Star, Phone, CreditCard as Edit, Trash2, TriangleAlert as AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { apiDb, type Driver } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const statusMap: Record<string, { label: string; class: string }> = {
  available: { label: 'متاح', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  on_trip: { label: 'في رحلة', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  off_duty: { label: 'إجازة', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  inactive: { label: 'غير نشط', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

const emptyDriver = {
  full_name: '', phone: '', email: '', license_number: '',
  license_expiry: '', status: 'available', notes: '',
}

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [filtered, setFiltered] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dialog, setDialog] = useState(false)
  const [form, setForm] = useState<typeof emptyDriver>({ ...emptyDriver })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    apiDb.from('drivers').select('*').order('full_name').then(({ data }) => {
      setDrivers(data ?? [])
      setFiltered(data ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = drivers
    if (statusFilter !== 'all') result = result.filter(d => d.status === statusFilter)
    if (search) result = result.filter(d =>
      d.full_name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.license_number.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [statusFilter, search, drivers])

  const openAdd = () => { setForm({ ...emptyDriver }); setEditId(null); setDialog(true) }
  const openEdit = (d: Driver) => {
    setForm({
      full_name: d.full_name, phone: d.phone, email: d.email ?? '',
      license_number: d.license_number, license_expiry: d.license_expiry,
      status: d.status, notes: d.notes ?? '',
    })
    setEditId(d.id)
    setDialog(true)
  }

  const save = async () => {
    if (!form.full_name || !form.phone || !form.license_number) {
      toast.error('يرجى ملء الحقول المطلوبة'); return
    }
    setSaving(true)
    const payload = {
      full_name: form.full_name, phone: form.phone,
      email: form.email || null, license_number: form.license_number,
      license_expiry: form.license_expiry,
      status: form.status as Driver['status'],
      notes: form.notes || null,
    }
    const { error } = editId
      ? await apiDb.from('drivers').update(payload).eq('id', editId)
      : await apiDb.from('drivers').insert(payload)
    setSaving(false)
    if (error) { toast.error('حدث خطأ: ' + error.message); return }
    toast.success(editId ? 'تم تحديث بيانات السائق' : 'تم إضافة السائق')
    setDialog(false)
    load()
  }

  const deleteDriver = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السائق؟')) return
    const { error } = await apiDb.from('drivers').delete().eq('id', id)
    if (error) { toast.error('فشل الحذف'); return }
    toast.success('تم حذف السائق')
    load()
  }

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const isLicenseExpiringSoon = (expiry: string) => {
    const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000)
    return days >= 0 && days <= 30
  }

  const isLicenseExpired = (expiry: string) => {
    return new Date(expiry).getTime() < Date.now()
  }

  const stats = {
    total: drivers.length,
    available: drivers.filter(d => d.status === 'available').length,
    on_trip: drivers.filter(d => d.status === 'on_trip').length,
    expiring: drivers.filter(d => d.license_expiry && (isLicenseExpiringSoon(d.license_expiry) || isLicenseExpired(d.license_expiry))).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Cairo' }}>إدارة السائقين</h1>
          <p className="text-sm text-muted-foreground mt-1">{drivers.length} سائق مسجل</p>
        </div>
        <Button onClick={openAdd} className="gap-2 font-semibold">
          <Plus className="size-4" />إضافة سائق
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي', value: stats.total, color: 'text-foreground' },
          { label: 'متاحون', value: stats.available, color: 'text-emerald-600' },
          { label: 'في رحلات', value: stats.on_trip, color: 'text-amber-600' },
          { label: 'رخصة منتهية', value: stats.expiring, color: 'text-red-600' },
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
          <Input placeholder="بحث بالاسم أو الجوال..." className="pr-9" value={search} onChange={e => setSearch(e.target.value)} />
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground">لا يوجد سائقون</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(driver => {
            const status = statusMap[driver.status]
            const licenseAlert = driver.license_expiry && (isLicenseExpired(driver.license_expiry) || isLicenseExpiringSoon(driver.license_expiry))
            return (
              <Card key={driver.id} className={cn('border-border/60', licenseAlert && 'border-amber-300 dark:border-amber-700')}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="size-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                      {driver.full_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground">{driver.full_name}</h3>
                      <p className="text-xs text-muted-foreground" dir="ltr">{driver.phone}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn('size-3', i < Math.round(driver.rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground')} />
                        ))}
                        <span className="text-xs text-muted-foreground mr-1">{driver.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold shrink-0', status.class)}>
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div>
                      <div className="text-muted-foreground">رقم الرخصة</div>
                      <div className="font-mono font-semibold mt-0.5">{driver.license_number}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">انتهاء الرخصة</div>
                      <div className={cn('font-semibold mt-0.5', licenseAlert ? 'text-amber-600' : '')}>
                        {driver.license_expiry}
                        {licenseAlert && <AlertTriangle className="size-3 inline mr-1" />}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">إجمالي الرحلات</div>
                      <div className="font-bold mt-0.5">{driver.total_trips}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5 h-8" onClick={() => openEdit(driver)}>
                      <Edit className="size-3.5" />تعديل
                    </Button>
                    <a href={`tel:${driver.phone}`}>
                      <Button variant="outline" size="sm" className="h-8 px-3">
                        <Phone className="size-3.5" />
                      </Button>
                    </a>
                    <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteDriver(driver.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-black text-right">
              {editId ? 'تعديل السائق' : 'إضافة سائق جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>الاسم الكامل *</Label>
              <Input placeholder="محمد أحمد العنزي" value={form.full_name} onChange={e => set('full_name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>الجوال *</Label>
              <Input placeholder="+966 5XX" dir="ltr" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input type="email" dir="ltr" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>رقم الرخصة *</Label>
              <Input dir="ltr" value={form.license_number} onChange={e => set('license_number', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>تاريخ انتهاء الرخصة</Label>
              <Input type="date" value={form.license_expiry} onChange={e => set('license_expiry', e.target.value)} />
            </div>
            <div className="col-span-2 space-y-2">
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
            <div className="col-span-2 space-y-2">
              <Label>ملاحظات</Label>
              <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>إلغاء</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إضافة السائق'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
