'use client'
import { useGetRideByIdQuery } from '@/redux/ride/rideApi'
import { Loader2Icon } from 'lucide-react';
import React from 'react'
import { useSearchPayload } from '@/hooks/useSearchPayload';
import FullRideSection from './FullRideSection';
import PassengerSection from './PassengerSection';
import UserSection from './UserSection';
import SegmentSection from './SegmentSection';

const RidePage = ({ id }: { id: string }) => {
  const { payload, isValid } = useSearchPayload()
  const { data: ride, isLoading, isError } = useGetRideByIdQuery(id);

  if (isLoading) {
    return <div className='h-full w-full items-center justify-center flex'><Loader2Icon className='animate-spin h-5 w-5' /></div>
  }
  if (isError || !ride) {
    return <div className='h-full w-full items-center justify-center flex'>Error</div>
  }

  return (
    <div className='flex flex-col grow gap-y-4 p-10'>
      <div className='flex gap-x-2'>
        <div className='flex flex-col grow gap-y-4'>
          <SegmentSection ride={ride} />
          <UserSection />
          <PassengerSection ride={ride} />
        </div>
        <FullRideSection ride={ride} />
      </div>
    </div>
  )
}

export default RidePage