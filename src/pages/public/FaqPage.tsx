import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { MessageCircle, Phone } from 'lucide-react'

const faqs = [
  { q: 'ما هي المناطق التي تغطيها خدماتكم؟', a: 'نغطي جميع مناطق المملكة العربية السعودية، مع التركيز على المدن الرئيسية: الرياض، جدة، مكة المكرمة، المدينة المنورة، الدمام والجبيل.' },
  { q: 'كم عدد الأيام اللازمة للحجز المسبق؟', a: 'يُفضل الحجز قبل 48 ساعة على الأقل لضمان توافر أفضل المركبات والسائقين. لكننا نحاول استيعاب الطلبات العاجلة حسب التوافر.' },
  { q: 'هل يمكن الإلغاء واسترداد المبلغ؟', a: 'نعم، يمكن الإلغاء مجاناً قبل 24 ساعة من موعد الرحلة. أما الإلغاء خلال 24 ساعة فيخضع لرسوم إلغاء 20% من قيمة الحجز.' },
  { q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل الدفع نقداً، بطاقات الائتمان والخصم، وبنك مدى. للعقود المؤسسية نقبل التحويل البنكي والفوترة الشهرية.' },
  { q: 'هل مركباتكم مؤمنة؟', a: 'نعم، جميع مركباتنا مؤمنة تأميناً شاملاً يغطي الركاب والممتلكات، وكذلك المركبة والمسؤولية المدنية.' },
  { q: 'هل يمكن توفير خدمة مضيفة مع الرحلة؟', a: 'نعم، للجولات السياحية والرحلات الكبيرة يمكن توفير مرافق أو مضيف بتكلفة إضافية حسب الطلب.' },
  { q: 'كيف يمكنني تتبع رحلتي؟', a: 'نوفر رقم تتبع فوري عبر واتساب عند تأكيد الحجز. في عقود الشركات والمدارس نوفر نظام تتبع GPS متكامل.' },
  { q: 'ماذا يحدث إذا تأخرت المركبة؟', a: 'نحن نلتزم بالمواعيد بشكل صارم. في حال أي تأخير غير متوقع، نتواصل فوراً ونوفر بديلاً في أسرع وقت ممكن.' },
]

export default function FaqPage() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 border-white/20 text-white">الأسئلة الشائعة</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>
            إجابات لأهم أسئلتك
          </h1>
          <p className="text-primary-foreground/75 max-w-lg mx-auto text-lg">
            لم تجد إجابتك؟ تواصل معنا مباشرةً وسنسعد بمساعدتك.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border/60 rounded-xl px-5 shadow-sm"
              >
                <AccordionTrigger className="text-right font-semibold text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-14 text-center">
            <p className="text-muted-foreground mb-6">لم تجد إجابتك؟ تواصل معنا الآن</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+966920000000">
                <Button size="lg" className="gap-2 font-bold"><Phone className="size-4" />اتصل بنا</Button>
              </a>
              <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 font-bold"><MessageCircle className="size-4" />واتساب</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
