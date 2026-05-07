import { Link } from 'react-router-dom'
import { ArrowLeft, Bus, Building2, GraduationCap, Car, Star, Shield, Clock, Award, Users, MapPin, Phone, CircleCheck as CheckCircle2, ChevronLeft, Wifi, Wind, Luggage, Zap, Globe, TrendingUp, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const services = [
  {
    icon: Bus,
    title: 'النقل السياحي',
    desc: 'جولات سياحية فاخرة بأسطول VIP مجهز بأحدث التقنيات لتجربة سفر لا تُنسى.',
    href: '/tours',
    color: 'from-blue-500/10 to-blue-600/5',
    iconBg: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: Building2,
    title: 'عقود الشركات',
    desc: 'حلول نقل الموظفين بعقود شهرية وسنوية مرنة مع مسارات مجدولة وإدارة احترافية.',
    href: '/corporate',
    color: 'from-emerald-500/10 to-emerald-600/5',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: GraduationCap,
    title: 'نقل المدارس',
    desc: 'نقل آمن وموثوق للطلاب مع مسارات ثابتة وجداول محددة وسائقين معتمدين.',
    href: '/school',
    color: 'from-amber-500/10 to-amber-600/5',
    iconBg: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: Car,
    title: 'الرحلات الخاصة',
    desc: 'حجز فوري لرحلات خاصة بمرونة تامة لأي وجهة وفي أي وقت تشاء.',
    href: '/booking',
    color: 'from-rose-500/10 to-rose-600/5',
    iconBg: 'bg-rose-500/10 text-rose-600',
  },
]

const stats = [
  { value: '+500', label: 'رحلة ناجحة', icon: MapPin },
  { value: '+50', label: 'عميل راضٍ', icon: Users },
  { value: '7', label: 'مركبات في الأسطول', icon: Bus },
  { value: '98%', label: 'رضا العملاء', icon: Star },
]

const features = [
  { icon: Shield, title: 'الأمان أولاً', desc: 'سائقون معتمدون ومركبات مصانة بأعلى المعايير' },
  { icon: Clock, title: 'الالتزام بالمواعيد', desc: 'نضمن وصولك في الوقت المحدد دون تأخير' },
  { icon: Award, title: 'خدمة ممتازة', desc: 'تقييم 5 نجوم من عملائنا لسنوات متتالية' },
  { icon: Wifi, title: 'واي فاي مجاني', desc: 'انترنت عالي السرعة في جميع مركباتنا الفاخرة' },
  { icon: Wind, title: 'تكييف هواء', desc: 'أجواء مريحة طوال رحلتك في أي طقس' },
  { icon: Luggage, title: 'مساحة أمتعة', desc: 'مساحة واسعة للأمتعة في جميع المركبات' },
]

const testimonials = [
  {
    name: 'أحمد الشمري',
    role: 'مدير الموارد البشرية — أرامكو',
    text: 'حديد أونلاين قدمت لنا حلاً متكاملاً لنقل موظفينا. الالتزام بالمواعيد والخدمة الاحترافية جعلتنا نجدد العقد سنوياً.',
    rating: 5,
  },
  {
    name: 'سارة العتيبي',
    role: 'مديرة مدرسة الفيصل',
    text: 'ثقتنا كاملة في حديد أونلاين لنقل طلابنا. سلامة الأطفال هي أولويتهم القصوى ونشعر بذلك يومياً.',
    rating: 5,
  },
  {
    name: 'خالد الزهراني',
    role: 'رئيس فريق سياحي',
    text: 'جولتنا إلى أبها كانت استثنائية. المركبات فاخرة والسائق كان محترفاً جداً. سنتعامل معهم دائماً.',
    rating: 5,
  },
]

const trustedCompanies = [
  'أرامكو السعودية', 'مجموعة بن لادن', 'الراجحي للتطوير',
  'شركة سابك', 'مدرسة الفيصل', 'فندق ماريوت'
]

const howItWorks = [
  { step: '01', title: 'اختر الخدمة', desc: 'حدد نوع الرحلة التي تحتاجها من خياراتنا المتنوعة' },
  { step: '02', title: 'أدخل التفاصيل', desc: 'حدد التواريخ والوجهات وعدد الركاب وتفضيلاتك' },
  { step: '03', title: 'استلم العرض', desc: 'سنتواصل معك فوراً بعرض سعر مفصل وشامل' },
  { step: '04', title: 'انطلق بثقة', desc: 'تأكيد الحجز وانطلق في رحلتك مع أفضل أسطول' },
]

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════ HERO ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/hero-bus.webp)' }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/90" />

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-10 size-64 rounded-full opacity-5 bg-accent blur-3xl" />
        <div className="absolute bottom-1/3 right-10 size-96 rounded-full opacity-5 bg-brand-blue blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 text-center py-32 md:py-40">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            منصة النقل الذكي الأولى في المملكة
          </div>

          {/* Main headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 text-balance"
            style={{ fontFamily: 'Cairo', lineHeight: '1.2' }}
          >
            وصولك يبدأ من هنا
            <br />
            <span className="shimmer">بأمان وفخامة</span>
          </h1>

          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            حديد أونلاين — منصة نقل متكاملة تخدم السياحة، الشركات، المدارس والرحلات الخاصة بأسطول فاخر وخدمة احترافية على مدار الساعة.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link to="/booking">
              <Button
                size="lg"
                className="text-base font-black gap-3 px-8 h-14 shadow-2xl hover:scale-105 transition-all"
                style={{ background: 'oklch(0.77 0.15 80)', color: '#0F172A' }}
              >
                احجز رحلة الآن
                <ArrowLeft className="size-5 rtl:rotate-180" />
              </Button>
            </Link>
            <Link to="/booking">
              <Button
                size="lg"
                variant="outline"
                className="text-base font-bold gap-3 px-8 h-14 border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm hover:scale-105 transition-all"
              >
                <MessageCircle className="size-5" />
                اطلب عرض سعر
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-5 text-center glass"
              >
                <div className="text-3xl font-black text-accent mb-1" style={{ fontFamily: 'Cairo' }}>
                  {stat.value}
                </div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs">
          <div className="size-8 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
            <ChevronLeft className="size-4 rotate-90" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ SERVICES ═══════════════════════════════════ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-brand-blue border-brand-blue/30 bg-brand-blue/5">
              خدماتنا
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4" style={{ fontFamily: 'Cairo' }}>
              حلول نقل متكاملة لكل احتياج
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              من السياحة إلى الشركات والمدارس، نوفر خدمة نقل راقية تناسب جميع الاحتياجات بأسعار تنافسية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => (
              <Link key={svc.title} to={svc.href}>
                <Card className={`h-full card-hover group border-border/60 bg-gradient-to-br ${svc.color} overflow-hidden`}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className={`size-12 rounded-xl flex items-center justify-center mb-5 ${svc.iconBg}`}>
                      <svc.icon className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{svc.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{svc.desc}</p>
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-brand-blue transition-colors">
                      اكتشف المزيد
                      <ArrowLeft className="size-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FLEET PREVIEW ══════════════════════════════ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-brand-blue border-brand-blue/30 bg-brand-blue/5">
                أسطولنا
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6 leading-tight" style={{ fontFamily: 'Cairo' }}>
                أسطول من الحافلات والفانات الفاخرة
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                أسطولنا مجهز بأحدث المركبات الأوروبية الفاخرة، تتراوح بين الحافلات الكبرى ذات الطاقة الاستيعابية العالية والفانات التنفيذية الخاصة، وجميعها تخضع لصيانة دورية منتظمة.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'حافلات سياحية VIP بطاقة تصل إلى 55 راكباً',
                  'فانات تنفيذية لـ 12-20 راكباً',
                  'جميع المركبات مزودة بتكييف هواء',
                  'خدمة واي فاي مجانية في المركبات الفاخرة',
                  'صيانة دورية وفحص يومي قبل كل رحلة',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/fleet">
                <Button size="lg" className="gap-2 font-bold">
                  استعرض أسطولنا الكامل
                  <ArrowLeft className="size-4 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/bus-exterior.webp"
                  alt="أسطول حديد أونلاين"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl shadow-xl p-5 border border-border">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl gold-gradient flex items-center justify-center">
                    <Award className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-foreground">7+</div>
                    <div className="text-xs text-muted-foreground">مركبات متاحة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ HOW IT WORKS ═══════════════════════════════ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-brand-blue border-brand-blue/30 bg-brand-blue/5">
              كيف نعمل
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4" style={{ fontFamily: 'Cairo' }}>
              4 خطوات بسيطة للحجز
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 right-[12.5%] left-[12.5%] h-px bg-border" />
            {howItWorks.map((step, i) => (
              <div key={step.step} className="text-center relative">
                <div className="size-24 rounded-2xl mx-auto mb-6 flex flex-col items-center justify-center shadow-lg border border-border relative bg-card">
                  <span
                    className="text-3xl font-black"
                    style={{ color: i === 0 ? 'oklch(0.77 0.15 80)' : undefined }}
                  >
                    {step.step}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ WHY US ══════════════════════════════════════ */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 border-white/20 bg-white/10 text-white/90">
              لماذا حديد أونلاين؟
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>
              نتفوق في كل التفاصيل
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto">
              نحن لا نقدم مجرد خدمة نقل — نصنع تجربة سفر لا تُنسى.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="size-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                  <feat.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1.5">{feat.title}</h3>
                  <p className="text-sm text-primary-foreground/65 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ TESTIMONIALS ═══════════════════════════════ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-brand-blue border-brand-blue/30 bg-brand-blue/5">
              آراء عملائنا
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4" style={{ fontFamily: 'Cairo' }}>
              ماذا يقول عملاؤنا؟
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="card-hover border-border/60">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                  <Separator className="mb-4" />
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full gold-gradient flex items-center justify-center text-sm font-bold text-white">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ TRUSTED BY ══════════════════════════════════ */}
      <section className="py-16 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-10 font-medium tracking-widest uppercase">
            يثق بنا
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 items-center">
            {trustedCompanies.map((company) => (
              <span
                key={company}
                className="text-muted-foreground/60 font-semibold text-lg hover:text-foreground transition-colors"
                style={{ fontFamily: 'Cairo' }}
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ CONTACT CTA ════════════════════════════════ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-brand-blue border-brand-blue/30 bg-brand-blue/5">
                تواصل معنا
              </Badge>
              <h2 className="text-3xl font-black text-foreground mb-4" style={{ fontFamily: 'Cairo' }}>
                هل لديك استفسار أو تريد عرض سعر؟
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                فريقنا متاح 24/7 للرد على استفساراتك وتقديم أفضل العروض المناسبة لاحتياجاتك.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="tel:+966500000000">
                  <Button size="lg" className="gap-2 font-bold">
                    <Phone className="size-4" />
                    اتصل بنا الآن
                  </Button>
                </a>
                <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="gap-2 font-bold">
                    <MessageCircle className="size-4" />
                    واتساب
                  </Button>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Globe, label: 'تغطية المملكة', value: 'جميع المناطق' },
                { icon: Clock, label: 'الدعم', value: '24 / 7' },
                { icon: TrendingUp, label: 'خبرة', value: '+10 سنوات' },
                { icon: Zap, label: 'استجابة سريعة', value: 'خلال ساعة' },
              ].map((item) => (
                <Card key={item.label} className="text-center border-border/60">
                  <CardContent className="p-5">
                    <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mx-auto mb-3">
                      <item.icon className="size-5" />
                    </div>
                    <div className="font-black text-lg text-foreground mb-1" style={{ fontFamily: 'Cairo' }}>
                      {item.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
