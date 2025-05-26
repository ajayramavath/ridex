import React from 'react'
import { getAuthSession } from '@/lib/authSession'
import { redirect } from 'next/navigation'
import RouteForm from '../RouteForm'

const page = async () => {
  const session = await getAuthSession()
  if (!session || !session.user || !session.user.name) redirect('/login')

  return (
    <RouteForm />
  )
}

export default page