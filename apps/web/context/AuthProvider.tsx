'use client'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

const AuthProvider = ({ children, session }: { children: ReactNode, session?: Session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}

export default AuthProvider