'use client'
import { ClientOnly } from '@ridex/ui/components/client-only'
import { MoonIcon, SunMediumIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

const Theme = () => {
  const { setTheme, theme } = useTheme()
  return (
    <ClientOnly>
      {theme === "light" ? <MoonIcon size={20} className='cursor-pointer' onClick={() => { setTheme("dark") }} /> :
        <SunMediumIcon size={20} className='cursor-pointer' onClick={() => { setTheme("light") }} />}
    </ClientOnly>
  )
}

export default Theme