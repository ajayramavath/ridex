import { RideWithPoints } from '@ridex/common'
import { Separator } from '@ridex/ui/components/separator'
import { cn } from '@ridex/ui/lib/utils'
import { CarFrontIcon, IndianRupee } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const PostedRide = ({ ride }: { ride: RideWithPoints }) => {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(`/ride/${ride.id}`)}
      className='flex relative w-full bg-card rounded-xl h-auto cursor-pointer my-5'>
      <div className='flex flex-col w-3/4 grow'>
        <div className='grow flex justify-start items-center gap-x-4 py-4 px-8'>
          <div className='self-stretch flex flex-col justify-center'>
            <div className="w-2 h-2 rounded-full border-2 border-foreground shadow-md"></div>
            <div className="h-[calc(100%-28px)] w-0.5 bg-gray-700 dark:bg-gray-300 ml-[3px]"></div>
            <div className="w-2 h-2 rounded-full border-2 border-foreground shadow-md"></div>
          </div>
          <div className='flex flex-col justify-between gap-y-4 md:gap-y-8'>
            <div className='flex flex-col'>
              <span className="font-bold text-sm md:text-lg">
                {ride.departure_point.city}
              </span>
              <div className='flex gap-x-2 items-center text-xs text-muted-foreground'>
                {ride.departure_point.full_address}
              </div>
            </div>
            <div className='flex flex-col'>
              <span className="font-bold text-sm md:text-lg">
                {ride.destination_point.city}
              </span>
              <div className='flex gap-x-2 items-center text-xs text-muted-foreground'>
                {ride.destination_point.full_address}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-1 items-center h-full'>
        <Separator orientation="vertical" className='absolute top-0 bottom-0 ' />
      </div>
      <div className='flex flex-col text-center items-center justify-center gap-y-4 text-sm font-bold md:text-md px-4 py-4'>
        <div className=''>
          Date: {new Date(ride.departure_time).toLocaleDateString()}
        </div>
        <div className='flex items-center'>
          Price: <IndianRupee size={18} className='font-bold' /> {Math.floor(ride.price as unknown as number)}
        </div>
      </div>
    </div>
  )
}

export default PostedRide