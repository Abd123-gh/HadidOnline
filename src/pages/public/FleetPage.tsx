import { useEffect, useState } from 'react'
import { Wifi, Wind, Luggage, Star, Wrench, CircleCheck as CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase, type Vehicle } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const statusMap: Record<string, { label: string; class: string }> = {
  available: { label: 'متاح', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  busy: { label: 'مشغول', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  maintenance: { label: 'صيانة', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  out_of_service: { label: 'خارج الخدمة', class: 'bg-slate-100 text-slate-800' },
}

const comfortMap: Record<string, { label: string; stars: number }> = {
  standard: { label: 'قياسي', stars: 3 },
  business: { label: 'أعمال', stars: 4 },
  vip: { label: 'VIP', stars: 5 },
}

const typeMap: Record<string, string> = {
  bus: 'حافلة',
  van: 'فان',
  minibus: 'مينيباس',
}

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filtered, setFiltered] = useState<Vehicle[]>([])
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('vehicles').select('*').order('name').then(({ data }) => {
      setVehicles(data ?? [])
      setFiltered(data ?? [])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let result = vehicles
    if (typeFilter !== 'all') result = result.filter(v => v.type === typeFilter)
    if (statusFilter !== 'all') result = result.filter(v => v.status === statusFilter)
    setFiltered(result)
  }, [typeFilter, statusFilter, vehicles])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 border-white/20 text-white">أسطولنا</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Cairo' }}>
            أسطول فاخر من الحافلات والفانات
          </h1>
          <p className="text-primary-foreground/75 max-w-xl mx-auto text-lg">
            {vehicles.length} مركبة متنوعة بين الحافلات الكبرى والفانات التنفيذية، جميعها معتمدة وخاضعة لصيانة دورية.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <p className="text-sm text-muted-foreground">
              عرض {filtered.length} من {vehicles.length} مركبة
            </p>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="bus">حافلات</SelectItem>
                  <SelectItem value="van">فانات</SelectItem>
                  <SelectItem value="minibus">مينيباس</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="available">متاح</SelectItem>
                  <SelectItem value="busy">مشغول</SelectItem>
                  <SelectItem value="maintenance">صيانة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((vehicle) => {
                const status = statusMap[vehicle.status]
                const comfort = comfortMap[vehicle.comfort_level]
                return (
                  <Card key={vehicle.id} className="card-hover overflow-hidden border-border/60 group">
                    {/* Image placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                      {vehicle.image_url ? (
                        <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl opacity-20">🚌</span>
                        </div>
                      )}
                      {/* Status badge */}
                      <div className="absolute top-3 right-3">
                        <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', status.class)}>
                          {status.label}
                        </span>
                      </div>
                      {/* Type badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/80 text-primary-foreground backdrop-blur-sm">
                          {typeMap[vehicle.type]}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-foreground">{vehicle.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{vehicle.model} {vehicle.year}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-0.5">
                            {Array.from({ length: comfort.stars }).map((_, i) => (
                              <Star key={i} className="size-3 text-accent fill-accent" />
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{comfort.label}</div>
                        </div>
                      </div>

                      {/* Capacity */}
                      <div className="text-2xl font-black text-foreground mb-4" style={{ fontFamily: 'Cairo' }}>
                        {vehicle.capacity} <span className="text-sm font-medium text-muted-foreground">راكب</span>
                      </div>

                      {/* Features */}
                      <div className="flex gap-3 mb-4">
                        {vehicle.has_ac && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Wind className="size-3.5 text-blue-500" />
                            تكييف
                          </div>
                        )}
                        {vehicle.has_wifi && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Wifi className="size-3.5 text-emerald-500" />
                            واي فاي
                          </div>
                        )}
                        {vehicle.has_luggage_space && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Luggage className="size-3.5 text-amber-500" />
                            أمتعة
                          </div>
                        )}
                        {vehicle.next_maintenance_date && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-auto">
                            <Wrench className="size-3.5 text-muted-foreground" />
                            {vehicle.next_maintenance_date}
                          </div>
                        )}
                      </div>

                      <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
                        <Button
                          className="w-full gap-2 font-semibold"
                          variant={vehicle.status === 'available' ? 'default' : 'outline'}
                          disabled={vehicle.status === 'maintenance' || vehicle.status === 'out_of_service'}
                        >
                          {vehicle.status === 'available' ? (
                            <><CheckCircle2 className="size-4" /> احجز هذه المركبة</>
                          ) : vehicle.status === 'busy' ? (
                            'مشغول حالياً — تواصل معنا'
                          ) : (
                            'تحت الصيانة'
                          )}
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
