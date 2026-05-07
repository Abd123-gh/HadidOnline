import { useEffect, useState } from 'react'
import { Plus, Search, Eye, CircleCheck as CheckCircle2, Circle as XCircle, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase, type Contract } from '@/lib/supabase'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const statusMap: Record<string, { label: string; class: string }> = {
  new: { label: 'جديد', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  negotiating: { label: 'تفاوض', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  active: { label: 'نشط', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  expired: { label: 'منتهي', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  cancelled: { label: 'ملغي', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

const typeMap: Record<string, string> = {
  corporate: 'شركة', school: 'مدرسة', tourist: 'سياحي'
}

const billingMap: Record<string, string> = {
  one_time: 'مرة واحدة', monthly: 'شهري', yearly: 'سنوي'
}

const emptyContract = {
  contract_number: '', client_id: '', type: 'corporate', status: 'new',
  start_date: '', end_date: '', monthly_amount: '', total_amount: '',
  billing_cycle: 'monthly', notes: '',
}

export default function AdminContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [filtered, setFiltered] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Contract | null>(null)
  const [dialog, setDialog] = useState(false)
  const [form, setForm] = useState<typeof emptyContract>({ ...emptyContract })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [updating, setUpdating] = useState(false)

  const load = () => {
    setLoading(true)
    supabase.from('contracts').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setContracts(data ?? [])
      setFiltered(data ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = contracts
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter)
    if (search) result = result.filter(c =>
      c.contract_number.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [statusFilter, search, contracts])

  const openAdd = () => {
    setForm({ ...emptyContract, contract_number: `CON-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}` })
    setEditId(null)
    setDialog(true)
  }

  const openEdit = (c: Contract) => {
    setForm({
      contract_number: c.contract_number, client_id: c.client_id ?? '',
      type: c.type, status: c.status,
      start_date: c.start_date ?? '', end_date: c.end_date ?? '',
      monthly_amount: String(c.monthly_amount ?? ''), total_amount: String(c.total_amount ?? ''),
      billing_cycle: c.billing_cycle, notes: c.notes ?? '',
    })
    setEditId(c.id)
    setDialog(true)
  }

  const save = async () => {
    if (!form.contract_number) { toast.error('يرجى إدخال رقم العقد'); return }
    setSaving(true)
    const payload = {
      contract_number: form.contract_number,
      type: form.type as Contract['type'],
      status: form.status as Contract['status'],
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      monthly_amount: form.monthly_amount ? Number(form.monthly_amount) : null,
      total_amount: form.total_amount ? Number(form.total_amount) : null,
      billing_cycle: form.billing_cycle as Contract['billing_cycle'],
      notes: form.notes || null,
    }
    const { error } = editId
      ? await supabase.from('contracts').update(payload).eq('id', editId)
      : await supabase.from('contracts').insert(payload)
    setSaving(false)
    if (error) { toast.error('حدث خطأ: ' + error.message); return }
    toast.success(editId ? 'تم تحديث العقد' : 'تم إضافة العقد')
    setDialog(false)
    load()
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true)
    const { error } = await supabase.from('contracts').update({ status }).eq('id', id)
    setUpdating(false)
    if (error) { toast.error('فشل التحديث'); return }
    toast.success('تم تحديث حالة العقد')
    setSelected(null)
    load()
  }

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const stats = {
    active: contracts.filter(c => c.status === 'active').length,
    new: contracts.filter(c => c.status === 'new').length,
    expiring: contracts.filter(c => {
      if (!c.end_date) return false
      const days = Math.ceil((new Date(c.end_date).getTime() - Date.now()) / 86400000)
      return days >= 0 && days <= 30 && c.status === 'active'
    }).length,
    total: contracts.length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Cairo' }}>إدارة العقود</h1>
          <p className="text-sm text-muted-foreground mt-1">{contracts.length} عقد في النظام</p>
        </div>
        <Button onClick={openAdd} className="gap-2 font-semibold">
          <Plus className="size-4" />إضافة عقد
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي', value: stats.total, color: 'text-foreground' },
          { label: 'نشطة', value: stats.active, color: 'text-emerald-600' },
          { label: 'جديدة', value: stats.new, color: 'text-blue-600' },
          { label: 'تنتهي قريباً', value: stats.expiring, color: 'text-amber-600' },
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
          <Input placeholder="بحث برقم العقد..." className="pr-9" value={search} onChange={e => setSearch(e.target.value)} />
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
        <CardHeader className="border-b border-border pb-4 flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">{filtered.length} عقد</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              جاري التحميل...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">لا توجد عقود</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">رقم العقد</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">النوع</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">دورة الفوترة</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">تاريخ البدء</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">تاريخ الانتهاء</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">المبلغ الشهري</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">الحالة</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(contract => {
                    const status = statusMap[contract.status]
                    const isExpiringSoon = contract.end_date && (() => {
                      const days = Math.ceil((new Date(contract.end_date!).getTime() - Date.now()) / 86400000)
                      return days >= 0 && days <= 30
                    })()
                    return (
                      <tr key={contract.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-mono text-xs font-semibold text-foreground">{contract.contract_number}</div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="outline" className="text-xs">{typeMap[contract.type]}</Badge>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground">{billingMap[contract.billing_cycle]}</td>
                        <td className="px-5 py-4 text-xs text-muted-foreground">{contract.start_date ?? '—'}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">{contract.end_date ?? '—'}</span>
                            {isExpiringSoon && <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs font-semibold">
                          {contract.monthly_amount ? `${contract.monthly_amount.toLocaleString()} ر.س` : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', status.class)}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-7 px-2 gap-1.5 text-xs" onClick={() => setSelected(contract)}>
                              <Eye className="size-3.5" />عرض
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openEdit(contract)}>
                              تعديل
                            </Button>
                          </div>
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
                تفاصيل العقد — {selected.contract_number}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">النوع</Label><p className="font-semibold mt-1">{typeMap[selected.type]}</p></div>
                <div><Label className="text-xs text-muted-foreground">دورة الفوترة</Label><p className="font-semibold mt-1">{billingMap[selected.billing_cycle]}</p></div>
                <div><Label className="text-xs text-muted-foreground">تاريخ البدء</Label><p className="font-semibold mt-1">{selected.start_date ?? '—'}</p></div>
                <div><Label className="text-xs text-muted-foreground">تاريخ الانتهاء</Label><p className="font-semibold mt-1">{selected.end_date ?? '—'}</p></div>
                <div><Label className="text-xs text-muted-foreground">المبلغ الشهري</Label><p className="font-semibold mt-1">{selected.monthly_amount ? `${selected.monthly_amount.toLocaleString()} ر.س` : '—'}</p></div>
                <div><Label className="text-xs text-muted-foreground">المبلغ الإجمالي</Label><p className="font-semibold mt-1">{selected.total_amount ? `${selected.total_amount.toLocaleString()} ر.س` : '—'}</p></div>
              </div>
              {selected.notes && (
                <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                  <strong>ملاحظات: </strong>{selected.notes}
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              {selected.status === 'new' && (
                <Button size="sm" className="gap-1.5" onClick={() => updateStatus(selected.id, 'negotiating')} disabled={updating}>
                  <Clock className="size-3.5" />بدء التفاوض
                </Button>
              )}
              {selected.status === 'negotiating' && (
                <Button size="sm" className="gap-1.5" onClick={() => updateStatus(selected.id, 'active')} disabled={updating}>
                  <CheckCircle2 className="size-3.5" />تفعيل
                </Button>
              )}
              {selected.status === 'active' && (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => updateStatus(selected.id, 'expired')} disabled={updating}>
                  <TrendingUp className="size-3.5" />إنهاء العقد
                </Button>
              )}
              {['new', 'negotiating'].includes(selected.status) && (
                <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => updateStatus(selected.id, 'cancelled')} disabled={updating}>
                  <XCircle className="size-3.5" />إلغاء
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-black text-right">
              {editId ? 'تعديل العقد' : 'إضافة عقد جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>رقم العقد *</Label>
              <Input value={form.contract_number} onChange={e => set('contract_number', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>النوع</Label>
              <Select value={form.type} onValueChange={v => set('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporate">شركة</SelectItem>
                  <SelectItem value="school">مدرسة</SelectItem>
                  <SelectItem value="tourist">سياحي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>دورة الفوترة</Label>
              <Select value={form.billing_cycle} onValueChange={v => set('billing_cycle', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">مرة واحدة</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="yearly">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>تاريخ البدء</Label>
              <Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>تاريخ الانتهاء</Label>
              <Input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>المبلغ الشهري (ر.س)</Label>
              <Input type="number" value={form.monthly_amount} onChange={e => set('monthly_amount', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>المبلغ الإجمالي (ر.س)</Label>
              <Input type="number" value={form.total_amount} onChange={e => set('total_amount', e.target.value)} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>ملاحظات</Label>
              <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>إلغاء</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إضافة العقد'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
