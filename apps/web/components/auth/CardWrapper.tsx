'use client'
import { Card, CardContent, CardHeader } from '@ridex/ui/components/card'
import React from 'react'
import AuthHeader from './AuthHeader'
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'
import { Drawer, DrawerContent, DrawerHeader } from '@ridex/ui/components/drawer'

interface CardWrapperProps {
  title: string
  description: string
  children: React.ReactNode
}

const CardWrapper = ({ title, description, children }: CardWrapperProps) => {
  return (
    <Card className='xl:w-1/3 sm:w-1/2 w-full shadow-md'>
      <CardHeader>
        <AuthHeader title={title} description={description} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

export default CardWrapper