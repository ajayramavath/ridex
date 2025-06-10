'use client'
import AutoCompleteInput from '@/components/AutoCompleteInput'
import { useAppSelector } from '@/redux/store/hooks'
import { cn } from '@ridex/ui/lib/utils'
import React, { Suspense } from 'react'
import Map from './Map'
import { Button } from '@ridex/ui/components/button'
import { MoveRightIcon } from 'lucide-react'
import Link from 'next/link'
import CreateButton, { BackButton } from './CreateButton'
import { ClientOnly } from '@ridex/ui/components/client-only'
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'


const AddressForm = ({ type, buttonHref }: { type: "departure" | "destination", buttonHref: string }) => {
  const { departure, destination } = useAppSelector(state => state.createRide)
  const { isMobile } = useMediaQuery()

  const location = type.includes('departure') ? departure : destination
  const currentType = type.includes('departure') ? 'departure' : 'destination'

  return (
    <div className={cn('flex md:flex-row flex-col w-full h-full justify-center gap-y-4 pt-2')}>
      <div className={cn(
        'flex flex-col md:gap-y-4 transition-all duration-500 md:h-full items-center md:py-10 px-4 w-full',
        location?.latitude ? 'md:w-1/3' : 'md:w-full',
      )}>
        <div className='md:text-3xl text-lg font-bold relative w-full flex justify-center'>
          {type === 'departure' ? 'Pick Up' : 'Drop Off'}
          <div className='absolute left-0 top-0'>
            <BackButton />
          </div>
        </div>
        {location?.latitude ?
          <div className='md:text-xl'>Pin your exact address on the map</div> :
          <div>{`Enter full address of the ${currentType === 'departure' ? 'pick up' : 'drop off'} location`}</div>}
        <div className={cn('my-4', location?.latitude || isMobile ? 'w-full' : 'w-1/2')}>
          <AutoCompleteInput
            type={type === 'departure' ? "createDeparture" : "createDestination"}
            placeholder={currentType === 'departure' ? 'Leaving from' : 'Going to'} />
        </div>
        {location && location.latitude && (
          <CreateButton />
        )}
      </div>
      <div
        className={cn(
          'bg-black transition-all duration-500 h-full',
          location?.latitude ? 'md:w-2/3 opacity-100 w-full' : 'w-0 opacity-0'
        )}>
        <Map type={currentType} />
      </div>
    </div>
  )
}

export default AddressForm