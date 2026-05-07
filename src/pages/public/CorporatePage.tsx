import { Link } from 'react-router-dom'
import { CircleCheck as CheckCircle2, Users, MapPin, Calendar, FileText, Phone, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const plans = [
  {
    title: 'شهري',
    price: 'يبدأ من 3,500',
    period: 'ريال / شهر',
    desc: 'مثالي للشركات الصغيرة',
    features: ['حتى 20 موظف', 'مسار واحد يومي', 'تقرير شهري', 'سائق ثابت'],
    popular: false,
  },
  {
    title: 'سنوي',
    price: 'يبدأ من 35,000',
    period: 'ريال / سنة',
    desc: 'الأفضل للشركات المتوسطة',
    features: ['حتى 50 موظف', 'مسارات متعددة', 'تقارير مفصلة', 'سائق ثابت + بديل', 'مدير حساب مخصص', 'دعم أولوية 24/7'],
    popular: true,
  },
  {
    title: 'مخصص',
    price: 'حسب الطلب',
    period: '',
    desc: 'للشركات الكبرى',
    features: ['عدد غير محدود من الموظفين', 'مسارات غير محدودة', 'نظام تتبع متكامل', 'فريق مخصص بالكامل', 'تكامل مع أنظمة HR', 'SLA مضمون'],
    popular: false,
  },
]

export default function CorporatePage() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 border-white/20 text-white">عقود الشركات</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>
            نقل موظفيك بأعلى معايير الاحترافية
          </h1>
          <p className="text-primary-foreground/75 max-w-xl mx-auto text-lg">
            عقود نقل مرنة وشاملة تضمن وصول موظفيك في الوقت المحدد وبأمان تام.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-black mb-6" style={{ fontFamily: 'Cairo' }}>
                لماذا تختار حديد أونلاين لشركتك؟
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Calendar, title: 'مواعيد منتظمة', desc: 'جدولة يومية دقيقة لمسارات التوصيل والاستقبال' },
                  { icon: MapPin, title: 'مسارات مخصصة', desc: 'تصميم مسارات تتناسب مع مواقع سكن موظفيك' },
                  { icon: Users, title: 'إدارة الموظفين', desc: 'نظام تتبع يومي وتقارير حضور مفصلة' },
                  { icon: FileText, title: 'فوترة منظمة', desc: 'فواتير شهرية شفافة ومفصلة لكل رحلة' },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                      <f.icon className="size-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">{f.title}</div>
                      <div className="text-sm text-muted-foreground">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img src="/corporate-transport.webp" alt="نقل الشركات" className="w-full h-80 object-cover" />
            </div>
          </div>

          {/* Plans */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black" style={{ fontFamily: 'Cairo' }}>باقات العقود</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map(plan => (
              <Card key={plan.title} className={`relative card-hover ${plan.popular ? 'border-brand-blue shadow-xl' : 'border-border/60'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 right-1/2 translate-x-1/2">
                    <Badge style={{ background: 'oklch(0.51 0.22 264)', color: 'white' }}>الأكثر طلباً</Badge>
                  </div>
                )}
                <CardContent className="p-7">
                  <div className="text-center mb-6">
                    <h3 className="font-black text-xl mb-1">{plan.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                    <div className="text-3xl font-black text-foreground" style={{ fontFamily: 'Cairo' }}>
                      {plan.price}
                    </div>
                    {plan.period && <div className="text-xs text-muted-foreground mt-1">{plan.period}</div>}
                  </div>
                  <ul className="space-y-2.5 mb-7">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking">
                    <Button className="w-full font-bold" variant={plan.popular ? 'default' : 'outline'}>
                      اطلب عرض سعر
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>
            هل أنت مستعد للتحدث عن عقد النقل لشركتك؟
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a href="tel:+966500000000">
              <Button size="lg" className="gap-2 font-bold"><Phone className="size-4" />اتصل بنا</Button>
            </a>
            <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2 font-bold"><MessageCircle className="size-4" />واتساب</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
