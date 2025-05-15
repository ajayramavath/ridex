import React from 'react'
import UserPage from './UserPage'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  if (!id) return <div>Invalid ride id</div>
  return (
    <UserPage id={id as string} />
  )
}

export default page