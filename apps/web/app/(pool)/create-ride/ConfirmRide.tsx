'use client'
import React from 'react'
import CreateButton, { BackButton } from './CreateButton'
import { useAppSelector } from '@/redux/store/hooks'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'
import { cn } from '@ridex/ui/lib/utils'

const ConfirmRide = () => {
  const { data: session } = useSession()
  if (!session) redirect('/login')
  const { departure, destination, departureTime, availableSeats, price } = useAppSelector(state => state.createRide)

  return (
    <div className={cn('flex h-full items-center py-10 px-4 flex-col gap-y-10')}>
      <h1 className='text-xl md:text-3xl font-bold relative w-full flex justify-center'>
        Confirm your ride
        <div className='absolute left-0 top-0'>
          <BackButton />
        </div>
      </h1>
      <div className='flex flex-col items-center h-full'>
        <div className='flex flex-col gap-y-4 w-full items-start mb-10 md:mb-0 md:grow'>
          <div className='flex md:gap-x-4 items-center'>
            <h1 className='text-lg md:text-2xl font-semibold min-w-34 md:min-w-48'>
              Pick up :
            </h1>
            <div className='text-sm md:text-md py-2 px-4  rounded-md'>
              {departure?.full_address}
            </div>
          </div>
          <div className='flex md:gap-x-4 items-center'>
            <h1 className='text-lg md:text-2xl font-semibold min-w-34 md:min-w-48'>
              Drop Off:
            </h1>
            <div className='text-sm md:text-md py-2 px-4  rounded-md'>
              {destination?.full_address}
            </div>
          </div>
          <div className='flex md:gap-x-4 items-center'>
            <h1 className='text-lg md:text-2xl font-semibold min-w-34 md:min-w-48'>
              Date :
            </h1>
            <div className='text-sm md:text-md py-2 px-4  rounded-md'>
              {departureTime ? new Date(departureTime).toLocaleString() : new Date().toLocaleString()}
            </div>
          </div>
          <div className='flex md:gap-x-4 items-center'>
            <h1 className='text-lg md:text-2xl font-semibold min-w-34 md:min-w-48'>
              Available Seats :
            </h1>
            <div className='text-sm md:text-md py-2 px-4  rounded-md'>
              {availableSeats}
            </div>
          </div>
          <div className='flex md:gap-x-4 items-center'>
            <h1 className='text-lg md:text-2xl font-semibold min-w-34 md:min-w-48'>
              Price :
            </h1>
            <div className='text-sm md:text-md py-2 px-4  rounded-md'>
              &#8377; {price}
            </div>
          </div>
        </div>
        <CreateButton />
      </div>
    </div>
  )
}

export default ConfirmRide