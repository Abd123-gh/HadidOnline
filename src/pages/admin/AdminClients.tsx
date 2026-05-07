import { useEffect, useState } from 'react'
import { Plus, Search, Building2, GraduationCap, User, CreditCard as Edit, Trash2, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { supabase, type Client } from '@/lib/supabase'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const typeMap: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  individual: { label: 'فرد', icon: User, class: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
  corporate: { label: 'شركة', icon: Building2, class: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' },
  school: { label: 'مدرسة', icon: GraduationCap, class: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30' },
}

const statusMap: Record<string, { label: string; class: string }> = {
  active: { label: 'نشط', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  inactive: { label: 'غير نشط', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  suspended: { label: 'موقوف', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

const emptyClient = {
  name: '', type: 'individual', phone: '', email: '',
  address: '', company_name: '', status: 'active',
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [filtered, setFiltered] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dialog, setDialog] = useState(false)
  const [form, setForm] = useState<typeof emptyClient>({ ...emptyClient })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState<Client | null>(null)

  const load = () => {
    setLoading(true)
    supabase.from('clients').select('*').order('name').then(({ data }) => {
      setClients(data ?? [])
      setFiltered(data ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = clients
    if (typeFilter !== 'all') result = result.filter(c => c.type === typeFilter)
    if (search) result = result.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.company_name?.toLowerCase().includes(search.toLowerCase()))
    )
    setFiltered(result)
  }, [typeFilter, search, clients])

  const openAdd = () => { setForm({ ...emptyClient }); setEditId(null); setDialog(true) }
  const openEdit = (c: Client) => {
    setForm({
      name: c.name, type: c.type, phone: c.phone,
      email: c.email ?? '', address: c.address ?? '',
      company_name: c.company_name ?? '', status: c.status,
    })
    setEditId(c.id)
    setDialog(true)
  }

  const save = async () => {
    if (!form.name || !form.phone) { toast.error('يرجى ملء الحقول المطلوبة'); return }
    setSaving(true)
    const payload = {
      name: form.name, type: form.type as Client['type'],
      phone: form.phone, email: form.email || null,
      address: form.address || null,
      company_name: form.company_name || null,
      status: form.status as Client['status'],
    }
    const { error } = editId
      ? await supabase.from('clients').update(payload).eq('id', editId)
      : await supabase.from('clients').insert(payload)
    setSaving(false)
    if (error) { toast.error('حدث خطأ: ' + error.message); return }
    toast.success(editId ? 'تم تحديث العميل' : 'تم إضافة العميل')
    setDialog(false)
    load()
  }

  const deleteClient = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) { toast.error('فشل الحذف'); return }
    toast.success('تم حذف العميل')
    load()
  }

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const stats = {
    total: clients.length,
    individual: clients.filter(c => c.type === 'individual').length,
    corporate: clients.filter(c => c.type === 'corporate').length,
    school: clients.filter(c => c.type === 'school').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Cairo' }}>إدارة العملاء</h1>
          <p className="text-sm text-muted-foreground mt-1">{clients.length} عميل مسجل</p>
        </div>
        <Button onClick={openAdd} className="gap-2 font-semibold">
          <Plus className="size-4" />إضافة عميل
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي', value: stats.total, color: 'text-foreground' },
          { label: 'أفراد', value: stats.individual, color: 'text-blue-600' },
          { label: 'شركات', value: stats.corporate, color: 'text-emerald-600' },
          { label: 'مدارس', value: stats.school, color: 'text-amber-600' },
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
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {Object.entries(typeMap).map(([v, t]) => (
              <SelectItem key={v} value={v}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground">لا يوجد عملاء</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(client => {
            const type = typeMap[client.type]
            const status = statusMap[client.status]
            const TypeIcon = type.icon
            return (
              <Card key={client.id} className="border-border/60">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={cn('size-10 rounded-xl flex items-center justify-center shrink-0', type.class)}>
                      <TypeIcon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{client.name}</h3>
                      {client.company_name && <p className="text-xs text-muted-foreground truncate">{client.company_name}</p>}
                      <p className="text-xs text-muted-foreground" dir="ltr">{client.phone}</p>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold shrink-0', status.class)}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <Badge variant="outline" className="text-xs">{type.label}</Badge>
                    <div className="mr-auto flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs" onClick={() => setSelected(client)}>
                        <Eye className="size-3.5" />عرض
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openEdit(client)}>
                        <Edit className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteClient(client.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Detail Dialog */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-black text-right">تفاصيل العميل</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs text-muted-foreground">الاسم</Label><p className="font-semibold mt-1">{selected.name}</p></div>
                <div><Label className="text-xs text-muted-foreground">النوع</Label><p className="font-semibold mt-1">{typeMap[selected.type].label}</p></div>
                <div><Label className="text-xs text-muted-foreground">الجوال</Label><p className="font-semibold mt-1" dir="ltr">{selected.phone}</p></div>
                <div><Label className="text-xs text-muted-foreground">البريد</Label><p className="font-semibold mt-1" dir="ltr">{selected.email ?? '—'}</p></div>
                {selected.company_name && <div className="col-span-2"><Label className="text-xs text-muted-foreground">اسم الشركة</Label><p className="font-semibold mt-1">{selected.company_name}</p></div>}
                {selected.address && <div className="col-span-2"><Label className="text-xs text-muted-foreground">العنوان</Label><p className="font-semibold mt-1">{selected.address}</p></div>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => { setSelected(null); openEdit(selected) }}>تعديل</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-black text-right">
              {editId ? 'تعديل العميل' : 'إضافة عميل جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>الاسم الكامل *</Label>
              <Input placeholder="محمد العتيبي" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>النوع</Label>
              <Select value={form.type} onValueChange={v => set('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">فرد</SelectItem>
                  <SelectItem value="corporate">شركة</SelectItem>
                  <SelectItem value="school">مدرسة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="suspended">موقوف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الجوال *</Label>
              <Input placeholder="+966 5XX" dir="ltr" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input type="email" placeholder="email@example.com" dir="ltr" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>اسم الشركة / المؤسسة</Label>
              <Input placeholder="شركة الرياض للنقل" value={form.company_name} onChange={e => set('company_name', e.target.value)} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>العنوان</Label>
              <Input placeholder="الرياض، حي..." value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>إلغاء</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إضافة العميل'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
