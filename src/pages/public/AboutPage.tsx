import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CircleCheck as CheckCircle2, Target, Eye, Heart } from 'lucide-react'

const values = [
  { icon: Target, title: 'مهمتنا', desc: 'تقديم خدمة نقل متميزة وموثوقة تلبي توقعات عملائنا وتتجاوزها في كل رحلة.' },
  { icon: Eye, title: 'رؤيتنا', desc: 'أن نكون الخيار الأول لخدمات النقل في المملكة العربية السعودية بحلول 2030.' },
  { icon: Heart, title: 'قيمنا', desc: 'الأمان، الالتزام، الاحترافية، الابتكار والتميز في كل ما نقدمه.' },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 border-white/20 text-white">من نحن</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Cairo' }}>
            قصة حديد أونلاين
          </h1>
          <p className="text-primary-foreground/75 max-w-2xl mx-auto text-lg leading-relaxed">
            أكثر من عقد من الخبرة في تقديم خدمات النقل المتميزة للسياح، الشركات والمدارس في أنحاء المملكة العربية السعودية.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black mb-6" style={{ fontFamily: 'Cairo' }}>بدأنا صغيراً وحلمنا كبيراً</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                تأسست حديد أونلاين عام 2014 بمركبة واحدة وحلم كبير — تغيير تجربة النقل في المملكة. بدأنا بخدمة شركة واحدة واليوم نخدم أكثر من 50 شريكاً من الشركات والمدارس والجهات السياحية.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                مع الوقت، طورنا أسطولنا ليضم أحدث الحافلات والفانات الأوروبية، وبنينا فريقاً متخصصاً من السائقين المعتمدين والإداريين المحترفين.
              </p>
              <ul className="space-y-2 mt-6">
                {['مرخصون من وزارة النقل', 'سائقون معتمدون ومؤهلون', 'تأمين شامل على جميع المركبات', 'دعم فني على مدار الساعة'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img src="/corporate-transport.webp" alt="حديد أونلاين" className="w-full h-80 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black" style={{ fontFamily: 'Cairo' }}>مهمتنا ورؤيتنا وقيمنا</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {values.map(v => (
              <Card key={v.title} className="text-center card-hover">
                <CardContent className="p-8">
                  <div className="size-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mx-auto mb-5">
                    <v.icon className="size-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
