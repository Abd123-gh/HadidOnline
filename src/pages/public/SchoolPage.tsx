import { Link } from 'react-router-dom'
import { Shield, Clock, MapPin, Bell, Phone, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const safetyFeatures = [
  { icon: Shield, title: 'سائقون معتمدون', desc: 'جميع سائقينا خاضعون لفحص أمني وتأهيل خاص لنقل الأطفال.' },
  { icon: Clock, title: 'مواعيد ثابتة', desc: 'جداول يومية دقيقة للاستقبال والتوصيل بدون أي تأخير.' },
  { icon: MapPin, title: 'تتبع آني', desc: 'نظام GPS يتيح للأهل متابعة موقع الحافلة في الوقت الفعلي.' },
  { icon: Bell, title: 'إشعارات فورية', desc: 'إشعار فوري للأهل عند ركوب الطفل ووصوله.' },
]

export default function SchoolPage() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 border-white/20 text-white">نقل المدارس</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>
            سلامة أطفالك أولويتنا القصوى
          </h1>
          <p className="text-primary-foreground/75 max-w-xl mx-auto text-lg">
            نظام نقل مدرسي آمن وموثوق يمنح الأهل راحة البال الكاملة في كل يوم دراسي.
          </p>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black" style={{ fontFamily: 'Cairo' }}>ضمانات السلامة لدينا</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyFeatures.map(f => (
              <Card key={f.title} className="text-center card-hover border-border/60">
                <CardContent className="p-7">
                  <div className="size-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center mx-auto mb-5">
                    <f.icon className="size-7" />
                  </div>
                  <h3 className="font-bold mb-3">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black" style={{ fontFamily: 'Cairo' }}>كيف يعمل نظام النقل المدرسي؟</h2>
          </div>
          <div className="space-y-4">
            {[
              { step: '01', title: 'تسجيل المدرسة', desc: 'نستلم قائمة الطلاب والمناطق السكنية لتصميم المسارات المثلى.' },
              { step: '02', title: 'تصميم المسارات', desc: 'نبني مسارات ذهاب وعودة محسوبة لتقليل وقت التنقل وزيادة الكفاءة.' },
              { step: '03', title: 'تعيين السائق والحافلة', desc: 'سائق ثابت مخصص لكل مسار مع مركبة مناسبة لعدد الطلاب.' },
              { step: '04', title: 'التشغيل والمتابعة', desc: 'رحلات يومية منتظمة مع تقارير دورية وتواصل مستمر مع المدرسة والأهل.' },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-5 p-5 rounded-2xl bg-background border border-border">
                <div
                  className="size-10 rounded-xl shrink-0 flex items-center justify-center font-black text-sm"
                  style={{ background: 'oklch(0.77 0.15 80)', color: '#0F172A' }}
                >
                  {s.step}
                </div>
                <div>
                  <div className="font-bold text-foreground mb-1">{s.title}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="max-w-2xl mx-auto text-xl text-foreground/70 italic font-medium leading-relaxed">
            "حديد أونلاين منحتنا راحة البال الكاملة — أطفالنا يصلون في الوقت المحدد وبأمان تام منذ 3 سنوات متواصلة."
          </blockquote>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              س
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm">سارة العتيبي</div>
              <div className="text-xs text-muted-foreground">مديرة مدرسة الفيصل الدولية</div>
            </div>
            <div className="flex gap-0.5 mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 text-accent fill-accent" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'Cairo' }}>
            هل مدرستك تحتاج خدمة نقل آمنة؟
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking">
              <Button size="lg" className="gap-2 font-bold">احجز الآن</Button>
            </Link>
            <a href="tel:+966500000000">
              <Button size="lg" variant="outline" className="gap-2 font-bold"><Phone className="size-4" />اتصل بنا</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
