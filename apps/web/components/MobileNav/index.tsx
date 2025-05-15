// components/MobileNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusSquare, User, MessageCircle, PlusCircleIcon, MousePointer2, UserCircle } from 'lucide-react'
import { Button } from '@ridex/ui/components/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@ridex/ui/components/tooltip'
import { motion } from 'framer-motion'

const navItems = [
  { label: 'Search', icon: Search, href: '/search' },
  { label: 'Create Ride', icon: PlusCircleIcon, href: '/create-ride' },
  { label: 'My rides', icon: MousePointer2, href: '/user-rides' },
  { label: 'Profile', icon: UserCircle, href: '/user-profile' }
]

const items = [
  { label: 'Search', icon: <Search />, href: '/search' },
  { label: 'Create Ride', icon: PlusCircleIcon, href: '/create-ride' }
]
const profileItems = [
  { label: 'My rides', icon: MousePointer2, href: '/user-rides' },
  { label: 'Profile', icon: UserCircle, href: '/user-profile' }
]

const MobileNav = () => {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className={`relative h-10 w-10 hover:!bg-background rounded-full ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <Link href={item.href} className='flex flex-col items-center'>
                    <item.icon className="h-3 w-3" />
                    <span className='text-xs'>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute inset-x-1 -bottom-1 h-0.5 bg-primary"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </Button>
              </TooltipTrigger>
            </Tooltip>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav