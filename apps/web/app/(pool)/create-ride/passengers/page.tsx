import React from 'react'
import PassengerForm from '../PassengerForm'
import { getAuthSession } from '@/lib/authSession'
import { redirect } from 'next/navigation'

const page = async () => {
  const session = await getAuthSession()
  if (!session || !session.user || !session.user.name) redirect('/login')
  return (
    <PassengerForm />
  )
}

export default page