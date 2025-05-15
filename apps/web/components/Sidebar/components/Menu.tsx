'use client'
import React, { useState } from 'react'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@ridex/ui/components/command'
import { MousePointer2, PlusCircleIcon, Search, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { cn } from '@ridex/ui/lib/utils'

const items = [
  { label: 'Search', icon: <Search />, href: '/search' },
  { label: 'Create Ride', icon: <PlusCircleIcon />, href: '/create-ride' }
]
const profileItems = [
  { label: 'My rides', icon: <MousePointer2 />, href: '/user-rides' },
  { label: 'Profile', icon: <UserCircle />, href: '/user-profile' }
]

const Menu = () => {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <Command className="rounded-lg bg-sidebar">
      <CommandList>
        <CommandGroup>
          {items.map((item, index) => {
            return (
              <CommandItem
                key={index + item.label}
                className={cn(pathname.includes(item.href) ? "bg-accent/10 text-accent dark:bg-primary/10 dark:text-primary" : "text-muted-foreground",
                  "hover:bg-gray-300 dark:hover:bg-border rounded-md transition-colors duration-200 my-2"
                )}
              >
                <Link href={item.href} className='flex items-center w-full gap-2'>
                  {item.icon}
                  {item.label}
                </Link>
              </CommandItem>
            )
          })}
        </CommandGroup>
        <CommandSeparator className='h-[1px] bg-gray-300 dark:bg-border' />
        <CommandGroup heading='Profile'
          className='[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-sm'>
          {profileItems.map((item, index) => {
            return (
              <CommandItem
                key={index + item.label}
                className={cn(pathname.includes(item.href) ? "bg-accent/10 text-accent dark:bg-primary/10 dark:text-primary" : "text-muted-foreground",
                  "hover:bg-gray-300 dark:hover:bg-border rounded-md transition-colors duration-200 my-2"
                )}
              >
                <Link href={item.href} className='flex w-full items-center gap-2'>
                  {item.icon}
                  {item.label}
                </Link>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export default Menu