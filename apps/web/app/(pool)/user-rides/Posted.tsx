'use client'
import PostedRide from '@/components/Profile/PostedRide';
import { useGetUserQuery } from '@/redux/user/userApi';
import { Loader2Icon } from 'lucide-react';
import React from 'react'

const Posted = () => {
  const { data: user, isLoading, isError } = useGetUserQuery();
  if (isLoading) {
    return (
      <div className="h-full w-full items-center justify-center flex">
        <Loader2Icon className='animate-spin h-5 w-5' />
      </div>
    )
  }
  if (isError) {
    return <div>Error</div>
  }
  if (user?.posted_rides.length === 0) {
    return (
      <div className='h-full text-2xl w-full items-center justify-center flex'>
        No Rides Posted
      </div>
    )
  }
  return (
    <div className="h-full w-full">
      {user?.posted_rides.map(ride => {
        return (
          <PostedRide key={ride.id} ride={ride} />
        )
      })}
    </div >
  )
}

export default Posted