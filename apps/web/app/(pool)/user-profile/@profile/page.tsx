import React from 'react'
import ProfilePage from '../ProfilePage'
import { getAuthSession } from '@/lib/authSession'
import { redirect } from 'next/navigation'


const page = async () => {
  const session = await getAuthSession()
  if (!session || !session.user || !session.user.name) redirect('/login')
  return (
    <ProfilePage />
  )
}

export default page