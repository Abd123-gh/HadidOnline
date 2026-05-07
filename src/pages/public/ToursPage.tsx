import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Users, ArrowLeft, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase, type TourPackage } from '@/lib/supabase'

export default function ToursPage() {
  const [tours, setTours] = useState<TourPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('tour_packages').select('*').eq('is_active', true).then(({ data }) => {
      setTours(data ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="pt-20">
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 border-white/20 text-white">الجولات السياحية</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>
            اكتشف جمال المملكة بأسلوب فاخر
          </h1>
          <p className="text-primary-foreground/75 max-w-xl mx-auto text-lg">
            برامج سياحية متنوعة بأسطول VIP وخدمة احترافية لا مثيل لها.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <Card key={tour.id} className="card-hover overflow-hidden border-border/60 group">
                  <div className="h-48 bg-gradient-to-br from-blue-900 to-blue-700 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-30">🏔️</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-white font-bold text-lg">{tour.name_ar}</h3>
                      <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
                        <MapPin className="size-3.5" />
                        {tour.destination}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">
                      {tour.description_ar || tour.description}
                    </p>
                    <div className="flex gap-4 mb-5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        {tour.duration_days} {tour.duration_days === 1 ? 'يوم' : 'أيام'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="size-3.5" />
                        {tour.min_passengers}–{tour.max_passengers} راكب
                      </div>
                      <div className="flex gap-0.5 mr-auto">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="size-3 text-accent fill-accent" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {tour.price_per_person && (
                        <div>
                          <span className="text-xs text-muted-foreground">من</span>
                          <span className="text-xl font-black text-foreground mx-1" style={{ fontFamily: 'Cairo' }}>
                            {tour.price_per_person.toLocaleString('ar-SA')}
                          </span>
                          <span className="text-xs text-muted-foreground">ريال / شخص</span>
                        </div>
                      )}
                      <Link to="/booking">
                        <Button size="sm" className="gap-1.5 font-semibold">
                          احجز الآن
                          <ArrowLeft className="size-3.5 rtl:rotate-180" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
