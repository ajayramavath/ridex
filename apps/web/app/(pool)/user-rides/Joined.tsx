'use client'
import { useGetUserQuery } from '@/redux/user/userApi';
import React from 'react'
import JoinedRides from '../user-profile/JoinedRides';
import { Loader2Icon } from 'lucide-react';

const Joined = () => {
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
  if (user?.joined_rides.length === 0) {
    return (
      <div className='h-full text-2xl w-full items-center justify-center flex'>
        No Rides Joined
      </div>
    )
  }
  return (
    <div className='h-full w-full'>
      {user?.joined_rides.map(joined => {
        return (
          <JoinedRides key={joined.id} passenger={joined} />
        )
      })}
    </div>
  )
}

export default Joined