import { useEffect, useState } from 'react'
import { Search, CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { supabase, type Invoice } from '@/lib/supabase'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const statusMap: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  pending: { label: 'معلقة', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  paid: { label: 'مدفوعة', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
  overdue: { label: 'متأخرة', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
  cancelled: { label: 'ملغاة', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', icon: Clock },
}

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filtered, setFiltered] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [updating, setUpdating] = useState(false)

  const load = () => {
    setLoading(true)
    supabase.from('invoices').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setInvoices(data ?? [])
      setFiltered(data ?? [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = invoices
    if (statusFilter !== 'all') result = result.filter(i => i.status === statusFilter)
    if (search) result = result.filter(i => i.invoice_number.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [statusFilter, search, invoices])

  const markPaid = async (id: string) => {
    setUpdating(true)
    const { error } = await supabase.from('invoices').update({
      status: 'paid',
      paid_date: new Date().toISOString().split('T')[0],
    }).eq('id', id)
    setUpdating(false)
    if (error) { toast.error('فشل التحديث'); return }
    toast.success('تم تسجيل الدفع')
    setSelected(null)
    load()
  }

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total_amount, 0)
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.total_amount, 0)
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total_amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'Cairo' }}>الفواتير</h1>
        <p className="text-sm text-muted-foreground mt-1">إدارة الفواتير والمدفوعات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'إجمالي المحصّل', value: totalRevenue, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'قيد الانتظار', value: pendingAmount, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'فواتير متأخرة', value: overdueAmount, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
        ].map(s => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn('size-12 rounded-xl flex items-center justify-center shrink-0', s.bg)}>
                <span className={cn('text-lg font-black', s.color)}>ر.س</span>
              </div>
              <div>
                <div className={cn('text-xl font-black', s.color)} style={{ fontFamily: 'Cairo' }}>
                  {s.value.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="بحث برقم الفاتورة..." className="pr-9" value={search} onChange={e => setSearch(e.target.value)} />
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
          <CardTitle className="text-base font-bold">{filtered.length} فاتورة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              جاري التحميل...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">لا توجد فواتير</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">رقم الفاتورة</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">المبلغ</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">الضريبة</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">الإجمالي</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">تاريخ الاستحقاق</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">الحالة</th>
                    <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(invoice => {
                    const status = statusMap[invoice.status]
                    const StatusIcon = status.icon
                    return (
                      <tr key={invoice.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm font-semibold">{invoice.invoice_number}</span>
                        </td>
                        <td className="px-5 py-4 text-sm">{invoice.amount.toLocaleString()} ر.س</td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{invoice.tax_amount.toLocaleString()} ر.س</td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-sm">{invoice.total_amount.toLocaleString()} ر.س</span>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground">{invoice.due_date ?? '—'}</td>
                        <td className="px-5 py-4">
                          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', status.class)}>
                            <StatusIcon className="size-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Button variant="ghost" size="sm" className="h-7 px-2 gap-1.5 text-xs" onClick={() => setSelected(invoice)}>
                            <Eye className="size-3.5" />عرض
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

      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-black text-right">
                فاتورة {selected.invoice_number}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المبلغ الأساسي</span>
                  <span className="font-semibold">{selected.amount.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                  <span className="font-semibold">{selected.tax_amount.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-bold">الإجمالي</span>
                  <span className="font-black text-lg">{selected.total_amount.toLocaleString()} ر.س</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs text-muted-foreground">تاريخ الاستحقاق</Label><p className="font-semibold mt-1">{selected.due_date ?? '—'}</p></div>
                <div><Label className="text-xs text-muted-foreground">تاريخ الدفع</Label><p className="font-semibold mt-1">{selected.paid_date ?? '—'}</p></div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">الحالة</Label>
                  <span className={cn('inline-flex mt-1 items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', statusMap[selected.status].class)}>
                    {statusMap[selected.status].label}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              {selected.status === 'pending' || selected.status === 'overdue' ? (
                <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700" onClick={() => markPaid(selected.id)} disabled={updating}>
                  <CheckCircle2 className="size-3.5" />تسجيل الدفع
                </Button>
              ) : null}
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}>إغلاق</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
