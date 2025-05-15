'use client'
import { Button } from '@ridex/ui/components/button'
import { PowerIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React from 'react'

const Logout = () => {
  return (
    <Button icon={<PowerIcon />} variant="ghost" onClick={() => {
      signOut({ callbackUrl: '/' })
    }}>
      Logout
    </Button>
  )
}

export default Logout