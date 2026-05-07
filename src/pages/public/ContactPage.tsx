import { useState } from 'react'
import { toast } from 'sonner'
import { Phone, Mail, MapPin, MessageCircle, Send, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    toast.success('تم إرسال رسالتك بنجاح! سنرد عليك قريباً.')
    setForm({ name: '', phone: '', email: '', message: '' })
  }

  return (
    <div className="pt-20">
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 border-white/20 text-white">تواصل معنا</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>
            نحن هنا لمساعدتك
          </h1>
          <p className="text-primary-foreground/75 max-w-lg mx-auto text-lg">
            فريقنا متاح على مدار الساعة للرد على استفساراتك وتقديم أفضل الحلول.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-black mb-8" style={{ fontFamily: 'Cairo' }}>معلومات التواصل</h2>
              <div className="space-y-5 mb-10">
                {[
                  { icon: Phone, label: 'الهاتف', value: '920 000 000', href: 'tel:+966920000000', dir: 'ltr' as const },
                  { icon: MessageCircle, label: 'واتساب', value: '+966 500 000 000', href: 'https://wa.me/966500000000', dir: 'ltr' as const },
                  { icon: Mail, label: 'البريد الإلكتروني', value: 'info@hadidonline.sa', href: 'mailto:info@hadidonline.sa', dir: 'ltr' as const },
                  { icon: MapPin, label: 'العنوان', value: 'الرياض، المملكة العربية السعودية', href: undefined, dir: 'rtl' as const },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                      <item.icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="font-semibold text-foreground hover:text-brand-blue transition-colors" dir={item.dir}>
                          {item.value}
                        </a>
                      ) : (
                        <div className="font-semibold text-foreground">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Card className="border-border/60 bg-muted/30">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-1">ساعات العمل</div>
                    <div className="text-sm text-muted-foreground">السبت – الخميس: 8 صباحاً – 10 مساءً</div>
                    <div className="text-sm text-muted-foreground">الطوارئ: 24/7</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <Card className="shadow-lg border-border/60">
              <CardContent className="p-7">
                <h2 className="text-xl font-black mb-6" style={{ fontFamily: 'Cairo' }}>أرسل لنا رسالة</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>الاسم</Label>
                    <Input placeholder="اسمك الكامل" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>الجوال</Label>
                      <Input placeholder="+966 5XX" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} dir="ltr" />
                    </div>
                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <Input type="email" placeholder="example@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} dir="ltr" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>رسالتك</Label>
                    <Textarea placeholder="كيف يمكننا مساعدتك؟" className="min-h-[120px]" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2 font-bold" disabled={loading}>
                    {loading ? 'جاري الإرسال...' : <><Send className="size-4" />إرسال الرسالة</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
