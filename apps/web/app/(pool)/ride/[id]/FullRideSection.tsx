import { GetRideResult } from '@ridex/common'
import { CircleAlert, IndianRupee, MapIcon } from 'lucide-react'
import React from 'react'
import { getUserRating, handleOpenMaps } from './utils'
import { Separator } from '@ridex/ui/components/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar'
import { StarIcon } from '../../search/Rating'
import { Button } from '@ridex/ui/components/button'

const FullRideSection = ({ ride }: { ride: GetRideResult }) => {
  return (
    <div className='hidden md:block'>
      <div>
        <div className='flex flex-col gap-y-4 grow w-full bg-card rounded-md p-4'>
          <div className='text-md font-bold flex gap-x-4'>
            {new Date(ride.departure_time).toDateString()}
            <span>{new Date(ride.departure_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</span>
          </div>
          <div className='grow flex justify-start items-center gap-x-4 py-4 px-8'>
            <div className='self-stretch flex flex-col justify-center'>
              <div className="w-2 h-2 rounded-full border-2 border-foreground shadow-md"></div>
              <div className="h-[calc(100%-28px)] w-0.5 bg-gray-700 dark:bg-gray-300 ml-[3px]"></div>
              <div className="w-2 h-2 rounded-full border-2 border-foreground shadow-md"></div>
            </div>
            <div className='flex flex-col justify-between gap-y-8'>
              <div className='flex flex-col'>
                <span className="font-bold text-lg flex gap-x-2 items-center">
                  {ride.departure_point.city}
                  <MapIcon
                    size={15}
                    className='text-blue-600 cursor-pointer'
                    onClick={() => handleOpenMaps(ride.departure_point.place_id)}
                  />
                </span>
                <div className='flex gap-x-2 items-center text-xs text-muted-foreground'>
                  {ride.departure_point.full_address}
                </div>
              </div>
              <div className='flex flex-col'>
                <span className="font-bold text-lg flex gap-x-2 items-center">
                  {ride.destination_point.city}
                  <MapIcon
                    size={15}
                    className='text-blue-600 cursor-pointer'
                    onClick={() => handleOpenMaps(ride.destination_point.place_id)}
                  />
                </span>
                <div className='flex gap-x-2 items-center text-xs text-muted-foreground'>
                  {ride.destination_point.full_address}
                </div>
              </div>
            </div>
          </div>
          <Separator className='my-0' />
          <div className='w-full flex items-center rounded-md'>
            <div className='p-4 rounded-md'>
              <Avatar className='w-10 h-10'>
                <AvatarImage src={ride.createdBy.profile_photo ? ride.createdBy.profile_photo : ''} />
                <AvatarFallback className='bg-red-400 text-sm'>
                  {ride.createdBy.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className='flex flex-col gap-y-1'>
              {ride.createdBy.name}
              <span className='flex items-center gap-x-1 text-muted-foreground'>
                <StarIcon className='h-4 w-4' /> {getUserRating(ride.createdBy.ratingsGot)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullRideSection