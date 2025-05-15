import React from 'react'
import AddressForm from '../AddressForm'
import { getAuthSession } from '@/lib/authSession'
import { redirect } from 'next/navigation'

const page = async () => {
  const session = await getAuthSession()
  if (!session || !session.user || !session.user.name) redirect('/login')
  return (
    <AddressForm buttonHref='/pool/create-ride/drop-off' type="departure" />
  )
}

export default page