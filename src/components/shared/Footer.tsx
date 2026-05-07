import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Logo from '@/components/shared/Logo'

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Banner */}
      <div
        className="py-14 px-4"
        style={{ background: 'linear-gradient(135deg, oklch(0.77 0.15 80) 0%, oklch(0.68 0.13 75) 100%)' }}
      >
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#0F172A', fontFamily: 'Cairo' }}>
            هل أنت مستعد للانطلاق؟
          </h2>
          <p className="text-lg mb-8 opacity-80" style={{ color: '#0F172A' }}>
            احجز رحلتك الآن وتمتع بتجربة نقل استثنائية مع حديد أونلاين
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking">
              <Button
                size="lg"
                className="font-black text-base gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                احجز رحلة الآن
                <ArrowLeft className="size-4 rtl:rotate-180" />
              </Button>
            </Link>
            <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="font-bold text-base gap-2"
                style={{ borderColor: '#0F172A', color: '#0F172A' }}
              >
                <MessageCircle className="size-4" />
                تواصل عبر واتساب
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo size="lg" variant="light" className="mb-6" />
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              حديد أونلاين — منصة النقل الذكي المتكاملة للسياحة والشركات والمدارس. خدمة احترافية، موثوقة وآمنة في جميع أنحاء المملكة العربية السعودية.
            </p>
            <div className="flex gap-3">
              {['f', 'in', 'x'].map(s => (
                <a key={s} href="#" className="size-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-xs font-bold">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-base mb-5">الخدمات</h4>
            <ul className="space-y-3">
              {[
                { href: '/tours', label: 'النقل السياحي' },
                { href: '/corporate', label: 'عقود الشركات' },
                { href: '/school', label: 'نقل المدارس' },
                { href: '/booking', label: 'الرحلات الخاصة' },
                { href: '/fleet', label: 'أسطولنا' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="size-1.5 rounded-full bg-accent opacity-60 group-hover:opacity-100 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-base mb-5">الشركة</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'من نحن' },
                { href: '/services', label: 'خدماتنا' },
                { href: '/faq', label: 'الأسئلة الشائعة' },
                { href: '/contact', label: 'تواصل معنا' },
                { href: '/admin', label: 'لوحة الإدارة' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="size-1.5 rounded-full bg-accent opacity-60 group-hover:opacity-100 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-base mb-5">تواصل معنا</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+966500000000" className="flex items-start gap-3 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors group">
                  <div className="size-8 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0">
                    <Phone className="size-3.5" />
                  </div>
                  <div>
                    <div className="text-xs text-primary-foreground/50 mb-0.5">الهاتف</div>
                    <div dir="ltr">920 000 000</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@hadidonline.sa" className="flex items-start gap-3 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors group">
                  <div className="size-8 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0">
                    <Mail className="size-3.5" />
                  </div>
                  <div>
                    <div className="text-xs text-primary-foreground/50 mb-0.5">البريد الإلكتروني</div>
                    <div>info@hadidonline.sa</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-primary-foreground/70">
                  <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="size-3.5" />
                  </div>
                  <div>
                    <div className="text-xs text-primary-foreground/50 mb-0.5">العنوان</div>
                    <div>الرياض، المملكة العربية السعودية</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} حديد أونلاين. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              سياسة الخصوصية
            </a>
            <a href="#" className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              الشروط والأحكام
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
