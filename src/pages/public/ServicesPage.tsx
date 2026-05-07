import { Link } from 'react-router-dom'
import { Bus, Building2, GraduationCap, Car, ArrowLeft, CircleCheck as CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const services = [
  {
    icon: Bus,
    title: 'النقل السياحي',
    desc: 'جولات سياحية فاخرة داخل وخارج المدن بأسطول VIP مجهز بأحدث التقنيات.',
    features: ['حافلات VIP مجهزة بالكامل', 'سائق خبير بالمسارات السياحية', 'خدمة واي فاي ومرطبات', 'جدولة مرنة حسب برنامج الجولة', 'أسعار جماعية تنافسية'],
    href: '/tours',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Building2,
    title: 'عقود الشركات',
    desc: 'حلول متكاملة لنقل الموظفين بعقود شهرية وسنوية مع إدارة متخصصة.',
    features: ['مسارات يومية منتظمة', 'عقود شهرية وسنوية', 'تقارير رحلات مفصلة', 'مدير حساب مخصص', 'فوترة شهرية مرنة'],
    href: '/corporate',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    icon: GraduationCap,
    title: 'نقل المدارس',
    desc: 'نظام نقل آمن ومنظم للطلاب مع مسارات ثابتة وجداول يومية دقيقة.',
    features: ['سائقون معتمدون لنقل الأطفال', 'مسارات ثابتة ومجدولة', 'تتبع الرحلات آني', 'إشعارات للأولياء', 'التزام تام بمعايير السلامة'],
    href: '/school',
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: Car,
    title: 'الرحلات الخاصة',
    desc: 'حجز فوري لرحلات خاصة لأي وجهة بمرونة تامة وأسعار مناسبة.',
    features: ['حجز فوري أو مسبق', 'فانات وحافلات بأحجام متعددة', 'مرونة في المواعيد', 'ذهاب وعودة', 'تغطية جميع مناطق المملكة'],
    href: '/booking',
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 border-white/20 text-white">خدماتنا</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>
            حلول نقل متكاملة لكل احتياج
          </h1>
          <p className="text-primary-foreground/75 max-w-xl mx-auto text-lg">
            نقدم 4 أنواع رئيسية من خدمات النقل تلبي جميع احتياجاتك الشخصية والمؤسسية.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                  <div className={`size-14 rounded-2xl ${svc.bg} flex items-center justify-center mb-5`}>
                    <svc.icon className={`size-7 ${svc.color}`} />
                  </div>
                  <h2 className="text-2xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>{svc.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{svc.desc}</p>
                  <ul className="space-y-2 mb-8">
                    {svc.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={svc.href}>
                    <Button className="gap-2 font-bold">
                      اكتشف المزيد
                      <ArrowLeft className="size-4 rtl:rotate-180" />
                    </Button>
                  </Link>
                </div>
                <Card className={`${svc.bg} border-0 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                  <CardContent className="p-10 text-center">
                    <svc.icon className={`size-24 mx-auto ${svc.color} opacity-20 mb-4`} />
                    <CardHeader className="p-0">
                      <CardTitle className={`text-2xl ${svc.color}`}>{svc.title}</CardTitle>
                    </CardHeader>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
