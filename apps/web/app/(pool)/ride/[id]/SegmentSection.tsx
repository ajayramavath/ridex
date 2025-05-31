import { MapIcon } from 'lucide-react'
import React from 'react'
import { handleOpenMaps } from './utils'
import { GetRideResult } from '@ridex/common'

const SegmentSection = ({ ride }: { ride: GetRideResult }) => {
  return (
    <div className='flex flex-col grow w-full bg-card rounded-md'>
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
    </div>
  )
}

export default SegmentSection