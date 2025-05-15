import React from 'react'
import RidePage from './RidePage';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  if (!id) return <div>Invalid ride id</div>
  return (
    <RidePage id={id as string} />
  )
}

export default page