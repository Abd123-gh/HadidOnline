import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, MessageCircle, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useTheme } from '@/components/theme-provider'
import Logo from '@/components/shared/Logo'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/services', label: 'خدماتنا' },
  { href: '/fleet', label: 'أسطولنا' },
  { href: '/tours', label: 'الجولات' },
  { href: '/corporate', label: 'عقود الشركات' },
  { href: '/school', label: 'نقل المدارس' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/">
            <Logo
              size="md"
              variant={scrolled ? 'color' : 'light'}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(link.href)
                    ? 'bg-accent text-accent-foreground'
                    : scrolled
                    ? 'text-foreground hover:bg-secondary hover:text-foreground'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                'size-9',
                !scrolled && 'text-white hover:bg-white/10 hover:text-white'
              )}
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            {/* WhatsApp */}
            <a
              href="https://wa.me/966500000000?text=مرحباً، أريد الاستفسار عن خدمات حديد أونلاين"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'size-9 hidden md:flex',
                  !scrolled && 'text-white hover:bg-white/10 hover:text-white'
                )}
              >
                <MessageCircle className="size-4" />
              </Button>
            </a>

            {/* Book Now CTA */}
            <Link to="/booking">
              <Button
                className="hidden md:flex gold-gradient text-primary-foreground font-bold shadow-lg hover:opacity-90 transition-all"
                style={{ background: 'oklch(0.77 0.15 80)', color: '#0F172A' }}
              >
                احجز الآن
              </Button>
            </Link>

            {/* Phone */}
            <a href="tel:+966500000000" className="hidden lg:flex">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2 font-medium',
                  !scrolled && 'border-white/30 text-white bg-white/10 hover:bg-white/20'
                )}
              >
                <Phone className="size-3.5" />
                <span>920 000 000</span>
              </Button>
            </a>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'lg:hidden size-9',
                    !scrolled && 'text-white hover:bg-white/10'
                  )}
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b bg-primary">
                    <div className="flex items-center justify-between">
                      <Logo size="md" variant="light" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(false)}
                        className="text-white hover:bg-white/10"
                      >
                        <X className="size-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Nav Links */}
                  <nav className="flex-1 p-4 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all',
                          isActive(link.href)
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-secondary'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Footer Actions */}
                  <div className="p-4 border-t space-y-2">
                    <Link to="/booking" onClick={() => setOpen(false)}>
                      <Button className="w-full font-bold" style={{ background: 'oklch(0.77 0.15 80)', color: '#0F172A' }}>
                        احجز رحلة الآن
                      </Button>
                    </Link>
                    <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full gap-2">
                        <MessageCircle className="size-4" />
                        واتساب
                      </Button>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
