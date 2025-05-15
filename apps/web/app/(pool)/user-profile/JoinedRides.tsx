import { PassengerWithRide, RideWithPoints } from '@ridex/common'
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar'
import { Separator } from '@ridex/ui/components/separator'
import { cn } from '@ridex/ui/lib/utils'
import { CarFrontIcon, IndianRupee, StarIcon } from 'lucide-react'
import React from 'react'

const JoinedRides = ({ passenger }: { passenger: PassengerWithRide }) => {
  const ride = passenger.ride
  return (
    <div className='flex w-full bg-card rounded-xl h-[220px] hover:dark:outline-primary hover:outline-accent hover:outline-2 cursor-pointer transition-all'>
      <div className='flex flex-col grow w-full'>
        <div className='grow flex justify-start items-center gap-x-4 py-4 px-8'>
          <div className='self-stretch flex flex-col justify-center'>
            <div className="w-2 h-2 rounded-full border-2 border-foreground shadow-md"></div>
            <div className="h-[calc(100%-28px)] w-0.5 bg-gray-700 dark:bg-gray-300 ml-[3px]"></div>
            <div className="w-2 h-2 rounded-full border-2 border-foreground shadow-md"></div>
          </div>
          <div className='flex flex-col justify-between gap-y-8'>
            <div className='flex flex-col'>
              <span className="font-bold text-lg">
                {ride.departure_point.city}
              </span>
              <div className='flex gap-x-2 items-center text-xs text-muted-foreground'>

              </div>
            </div>
            <div className='flex flex-col'>
              <span className="font-bold text-lg">
                {ride.destination_point.city}
              </span>
              <div className='flex gap-x-2 items-center text-xs text-muted-foreground'>
                {ride.destination_point.full_address}
              </div>
            </div>
          </div>
        </div>
        <Separator className='w-full' />
        <div className='flex gap-x-8 font-bold items-center text-xl px-4 py-4'>
          <div className=''>
            {new Date(ride.departure_time).toLocaleDateString()}
          </div>
          <div className='flex items-center'>
            <IndianRupee size={18} className='font-bold' /> {Math.floor(ride.price as unknown as number)}
          </div>
        </div>
      </div>
      <Separator orientation="vertical" className='' />
      <div className='flex flex-col items-center justify-center gap-y-4 px-10'>
        <div>
          <Avatar className='w-30 h-30'>
            <AvatarImage src={ride.createdBy.profile_photo ? ride.createdBy.profile_photo : ''} />
            <AvatarFallback className='bg-red-400 text-sm'>
              {ride.createdBy.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='flex flex-col items-center justify-center font-bold gap-x-2 text-sm w-full'>
          <div className='flex items-center'>
            <StarIcon className='w-4 h-4 text-[#EFBF04] fill-current' /> {4.5}
          </div>
          <span className='text-xs text-muted-foreground'>
            {`(10 Reviews)`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default JoinedRides