import { useState } from 'react'
import { toast } from 'sonner'
import { Send, Phone, MessageCircle, CircleCheck as CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { apiDb } from '@/lib/api'

interface FormData {
  client_name: string
  client_phone: string
  client_email: string
  trip_type: string
  contract_type: string
  trip_date: string
  trip_time: string
  passengers: string
  pickup_location: string
  destination: string
  return_trip: boolean
  return_date: string
  vehicle_preference: string
  notes: string
}

const initial: FormData = {
  client_name: '', client_phone: '', client_email: '',
  trip_type: '', contract_type: 'one_time',
  trip_date: '', trip_time: '',
  passengers: '1',
  pickup_location: '', destination: '',
  return_trip: false, return_date: '',
  vehicle_preference: '', notes: '',
}

export default function BookingPage() {
  const [form, setForm] = useState<FormData>(initial)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.client_name || !form.client_phone || !form.trip_type || !form.trip_date || !form.pickup_location || !form.destination) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }
    setLoading(true)
    const { error } = await apiDb.from('bookings').insert({
      client_name: form.client_name,
      client_phone: form.client_phone,
      client_email: form.client_email || null,
      trip_type: form.trip_type as 'tourist' | 'corporate' | 'school' | 'private',
      contract_type: form.contract_type as 'one_time' | 'monthly' | 'yearly' | 'recurring',
      trip_date: form.trip_date,
      trip_time: form.trip_time || '09:00',
      passengers: parseInt(form.passengers) || 1,
      pickup_location: form.pickup_location,
      destination: form.destination,
      return_trip: form.return_trip,
      return_date: form.return_date || null,
      vehicle_preference: form.vehicle_preference || null,
      notes: form.notes || null,
      source: 'website',
    })
    setLoading(false)
    if (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى')
      return
    }
    setSubmitted(true)
    toast.success('تم استلام طلبك بنجاح! سنتواصل معك قريباً.')
  }

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-lg px-4">
          <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>تم استلام طلبك!</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            شكراً {form.client_name}، تلقينا طلب الحجز الخاص بك وسيتواصل معك فريقنا خلال ساعة على الرقم <strong>{form.client_phone}</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 font-bold">
                <MessageCircle className="size-4" />
                تواصل عبر واتساب
              </Button>
            </a>
            <Button variant="outline" onClick={() => { setSubmitted(false); setForm(initial) }}>
              حجز رحلة أخرى
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 border-white/20 text-white">الحجز</Badge>
          <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'Cairo' }}>
            احجز رحلتك أو اطلب عرض سعر
          </h1>
          <p className="text-primary-foreground/75 max-w-lg mx-auto">
            أملأ النموذج وسيتواصل معك فريقنا خلال ساعة بعرض سعر مفصل.
          </p>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="shadow-xl border-border/60">
            <CardHeader className="border-b border-border pb-6">
              <CardTitle className="text-xl font-black">تفاصيل الحجز</CardTitle>
              <CardDescription>الحقول المعلمة بـ * مطلوبة</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-4">المعلومات الشخصية</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input id="name" placeholder="محمد أحمد العمري" value={form.client_name} onChange={e => set('client_name', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الجوال *</Label>
                      <Input id="phone" placeholder="+966 5XX XXX XXXX" value={form.client_phone} onChange={e => set('client_phone', e.target.value)} required dir="ltr" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" placeholder="example@email.com" value={form.client_email} onChange={e => set('client_email', e.target.value)} dir="ltr" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Trip Type */}
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-4">نوع الرحلة</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>نوع الرحلة *</Label>
                      <Select value={form.trip_type} onValueChange={v => set('trip_type', v)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الرحلة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tourist">سياحية</SelectItem>
                          <SelectItem value="corporate">شركة / أعمال</SelectItem>
                          <SelectItem value="school">مدرسة</SelectItem>
                          <SelectItem value="private">خاصة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>نوع العقد</Label>
                      <Select value={form.contract_type} onValueChange={v => set('contract_type', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one_time">مرة واحدة</SelectItem>
                          <SelectItem value="monthly">شهري</SelectItem>
                          <SelectItem value="yearly">سنوي</SelectItem>
                          <SelectItem value="recurring">مسار متكرر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Trip Details */}
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-4">تفاصيل الرحلة</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">تاريخ الرحلة *</Label>
                      <Input id="date" type="date" value={form.trip_date} onChange={e => set('trip_date', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">وقت الرحلة</Label>
                      <Input id="time" type="time" value={form.trip_time} onChange={e => set('trip_time', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passengers">عدد الركاب *</Label>
                      <Input id="passengers" type="number" min="1" max="60" value={form.passengers} onChange={e => set('passengers', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>تفضيل المركبة</Label>
                      <Select value={form.vehicle_preference} onValueChange={v => set('vehicle_preference', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="أي مركبة متاحة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">أي مركبة متاحة</SelectItem>
                          <SelectItem value="vip">VIP فاخر</SelectItem>
                          <SelectItem value="bus">حافلة كبيرة</SelectItem>
                          <SelectItem value="van">فان صغير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickup">نقطة الانطلاق *</Label>
                      <Input id="pickup" placeholder="المدينة / الحي / العنوان" value={form.pickup_location} onChange={e => set('pickup_location', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dest">الوجهة *</Label>
                      <Input id="dest" placeholder="المدينة / الحي / العنوان" value={form.destination} onChange={e => set('destination', e.target.value)} required />
                    </div>
                  </div>

                  {/* Return trip toggle */}
                  <div className="flex items-center gap-3 mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                    <Switch
                      checked={form.return_trip}
                      onCheckedChange={v => set('return_trip', v)}
                    />
                    <Label className="cursor-pointer">رحلة ذهاب وعودة</Label>
                  </div>
                  {form.return_trip && (
                    <div className="mt-3">
                      <Label htmlFor="return_date">تاريخ العودة</Label>
                      <Input id="return_date" type="date" className="mt-2" value={form.return_date} onChange={e => set('return_date', e.target.value)} />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    id="notes"
                    placeholder="أي متطلبات خاصة، عدد الأمتعة، احتياجات ذوي الإعاقة..."
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button type="submit" size="lg" className="flex-1 gap-2 font-bold text-base" disabled={loading}>
                    {loading ? (
                      <><span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> جاري الإرسال...</>
                    ) : (
                      <><Send className="size-4" /> أرسل الطلب</>
                    )}
                  </Button>
                  <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button type="button" size="lg" variant="outline" className="w-full gap-2 font-bold">
                      <MessageCircle className="size-4" />
                      واتساب
                    </Button>
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick contact */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <a href="tel:+966500000000">
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">اتصل بنا</div>
                    <div className="text-xs text-muted-foreground">920 000 000</div>
                  </div>
                </CardContent>
              </Card>
            </a>
            <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
              <Card className="hover:border-emerald-500 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">واتساب</div>
                    <div className="text-xs text-muted-foreground">رد فوري</div>
                  </div>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
