import React from 'react'
import Appearance from '../AppearancePage'
import { getAuthSession } from '@/lib/authSession'
import { redirect } from 'next/navigation'

const page = async () => {
  const session = await getAuthSession()
  if (!session || !session.user || !session.user.name) redirect('/login')
  return (
    <Appearance />
  )
}

export default page