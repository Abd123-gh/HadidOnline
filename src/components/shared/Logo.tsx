import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark' | 'color'
}

export default function Logo({ className, size = 'md', variant = 'color' }: LogoProps) {
  const sizes = { sm: 32, md: 44, lg: 60 }
  const px = sizes[size]
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* H Letter Logo - tilted left, red */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        {/* Rounded background */}
        <rect x="1" y="1" width="46" height="46" rx="12" fill="url(#logoGrad)" />
        {/* Letter H - slightly tilted left via transform */}
        <g transform="rotate(-8, 24, 24)">
          <rect x="11" y="10" width="7" height="28" rx="2" fill="white" />
          <rect x="30" y="10" width="7" height="28" rx="2" fill="white" />
          <rect x="11" y="20" width="26" height="7" rx="2" fill="white" />
        </g>
      </svg>

      {/* Brand name */}
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'font-black tracking-tight',
            textSizes[size],
            variant === 'light' ? 'text-white' : variant === 'dark' ? 'text-primary' : 'text-primary'
          )}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          حديد
        </span>
        <span
          className={cn(
            'text-xs font-semibold tracking-widest uppercase',
            variant === 'light' ? 'text-white/70' : 'text-muted-foreground'
          )}
          style={{ fontFamily: "'Cairo', sans-serif", fontSize: '0.6rem' }}
        >
          HADID ONLINE
        </span>
      </div>
    </div>
  )
}
