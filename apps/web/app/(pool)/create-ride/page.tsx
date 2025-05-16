import { authOptions } from '@/lib/auth'
import { getAuthSession } from '@/lib/authSession'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'
import CreateRide from './CreateRide'

const page = async () => {
  const session = await getAuthSession()
  console.log("Session:", session);
  if (!session || !session.user || !session.user.name) redirect('/login')

  return (
    <CreateRide />
  )
}

export default page