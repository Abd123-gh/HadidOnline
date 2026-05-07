import { useState } from 'react'
import { Save, Building2, Phone, Mail, MapPin, Bell, Globe, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function AdminSettings() {
  const [saving, setSaving] = useState(false)
  const [company, setCompany] = useState({
    name: 'حديد أونلاين',
    name_en: 'Hadid Online',
    phone: '920000000',
    whatsapp: '966500000000',
    email: 'info@hadidonline.sa',
    address: 'الرياض، المملكة العربية السعودية',
    description: 'منصة النقل الذكية لتأجير الحافلات وسيارات الأجرة في المملكة العربية السعودية',
  })
  const [notifications, setNotifications] = useState({
    new_booking: true,
    booking_confirmed: true,
    trip_completed: true,
    invoice_due: true,
    license_expiry: true,
    contract_expiry: true,
  })
  const [system, setSystem] = useState({
    language: 'ar',
    timezone: 'Asia/Riyadh',
    currency: 'SAR',
    vat_rate: '15',
    booking_advance_hours: '48',
    cancellation_hours: '24',
  })

  const saveSettings = async (section: string) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast.success(`تم حفظ إعدادات ${section}`)
  }

  const setComp = (k: string, v: string) => setCompany(p => ({ ...p, [k]: v }))
  const setNotif = (k: string, v: boolean) => setNotifications(p => ({ ...p, [k]: v }))
  const setSys = (k: string, v: string) => setSystem(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'Cairo' }}>الإعدادات</h1>
        <p className="text-sm text-muted-foreground mt-1">إدارة إعدادات المنصة والنظام</p>
      </div>

      {/* Company Info */}
      <Card className="border-border/60">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center">
              <Building2 className="size-4 text-primary" />
            </div>
            <CardTitle className="text-base font-bold">معلومات الشركة</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اسم الشركة (عربي)</Label>
              <Input value={company.name} onChange={e => setComp('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>اسم الشركة (إنجليزي)</Label>
              <Input dir="ltr" value={company.name_en} onChange={e => setComp('name_en', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>رقم الهاتف</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input className="pr-9" dir="ltr" value={company.phone} onChange={e => setComp('phone', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>واتساب</Label>
              <Input dir="ltr" value={company.whatsapp} onChange={e => setComp('whatsapp', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input className="pr-9" dir="ltr" value={company.email} onChange={e => setComp('email', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>العنوان</Label>
            <div className="relative">
              <MapPin className="absolute right-3 top-3 size-4 text-muted-foreground" />
              <Input className="pr-9" value={company.address} onChange={e => setComp('address', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>وصف الشركة</Label>
            <Textarea value={company.description} onChange={e => setComp('description', e.target.value)} className="min-h-[80px]" />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => saveSettings('الشركة')} disabled={saving} className="gap-2">
              <Save className="size-4" />حفظ التغييرات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="border-border/60">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center">
              <Globe className="size-4 text-primary" />
            </div>
            <CardTitle className="text-base font-bold">إعدادات النظام</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اللغة الافتراضية</Label>
              <Select value={system.language} onValueChange={v => setSys('language', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المنطقة الزمنية</Label>
              <Select value={system.timezone} onValueChange={v => setSys('timezone', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Riyadh">الرياض (UTC+3)</SelectItem>
                  <SelectItem value="Asia/Dubai">دبي (UTC+4)</SelectItem>
                  <SelectItem value="Africa/Cairo">القاهرة (UTC+2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>العملة</Label>
              <Select value={system.currency} onValueChange={v => setSys('currency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">ريال سعودي (ر.س)</SelectItem>
                  <SelectItem value="AED">درهم إماراتي</SelectItem>
                  <SelectItem value="USD">دولار أمريكي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>نسبة ضريبة القيمة المضافة (%)</Label>
              <Input type="number" min="0" max="100" value={system.vat_rate} onChange={e => setSys('vat_rate', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>الحد الأدنى للحجز المسبق (ساعات)</Label>
              <Input type="number" min="0" value={system.booking_advance_hours} onChange={e => setSys('booking_advance_hours', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>حد الإلغاء المجاني (ساعات)</Label>
              <Input type="number" min="0" value={system.cancellation_hours} onChange={e => setSys('cancellation_hours', e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => saveSettings('النظام')} disabled={saving} className="gap-2">
              <Save className="size-4" />حفظ التغييرات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border/60">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center">
              <Bell className="size-4 text-primary" />
            </div>
            <CardTitle className="text-base font-bold">إعدادات الإشعارات</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {[
            { key: 'new_booking', label: 'حجز جديد', desc: 'إشعار عند وصول طلب حجز جديد' },
            { key: 'booking_confirmed', label: 'تأكيد الحجز', desc: 'إشعار عند تأكيد حجز' },
            { key: 'trip_completed', label: 'اكتمال رحلة', desc: 'إشعار عند اكتمال رحلة' },
            { key: 'invoice_due', label: 'استحقاق فاتورة', desc: 'تذكير بمواعيد استحقاق الفواتير' },
            { key: 'license_expiry', label: 'انتهاء رخصة السائق', desc: 'تنبيه قبل 30 يوم من انتهاء الرخصة' },
            { key: 'contract_expiry', label: 'انتهاء عقد', desc: 'تنبيه قبل 30 يوم من انتهاء العقد' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-1">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={v => setNotif(item.key, v)}
              />
            </div>
          ))}
          <Separator />
          <div className="flex justify-end">
            <Button onClick={() => saveSettings('الإشعارات')} disabled={saving} className="gap-2">
              <Save className="size-4" />حفظ التغييرات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-border/60">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center">
              <Shield className="size-4 text-primary" />
            </div>
            <CardTitle className="text-base font-bold">الأمان وكلمة المرور</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="space-y-2">
            <Label>كلمة المرور الحالية</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>كلمة المرور الجديدة</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>تأكيد كلمة المرور</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => toast.success('تم تحديث كلمة المرور')} className="gap-2">
              <Shield className="size-4" />تحديث كلمة المرور
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
