'use client'
import { RideResult } from '@ridex/common'
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar'
import { Separator } from '@ridex/ui/components/separator'
import { cn } from '@ridex/ui/lib/utils'
import { Car, CarFrontIcon, IndianRupee } from 'lucide-react'
import React from 'react'
import Rating, { StarIcon } from './Rating'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'

const SingleSearch = ({ result }: { result: RideResult }) => {
  const router = useRouter()
  const { isMobile } = useMediaQuery()

  return (
    <div
      onClick={() => router.push(`/ride/${result.id}`)}
      className='flex w-full bg-card rounded-xl md:h-[220px] cursor-pointer'>
      <div className='flex flex-col grow w-full'>
        <div className='flex w-full'>
          <div className='grow flex justify-start items-center gap-x-4 py-4 px-4 md:py-4 md:px-8'>
            <div className='self-stretch flex flex-col justify-center'>
              <div className="w-2 h-2 rounded-full border-2 border-foreground shadow-md"></div>
              <div className="h-[calc(100%-28px)] w-0.5 bg-gray-700 dark:bg-gray-300 ml-[3px]"></div>
              <div className="w-2 h-2 rounded-full border-2 border-foreground shadow-md"></div>
            </div>
            <div className='flex flex-col justify-between gap-y-4 md:gap-y-8'>
              <div className='flex flex-col'>
                <span className="font-bold text-xs md:text-lg">
                  {result.departure_point.city}
                </span>
                <div className='flex flex-col md:flex-row gap-x-2 items-start md:items-center text-[8px] text-muted-foreground'>
                  <div className='flex gap-x-2 items-center'>
                    <Car size={isMobile ? 10 : 18} className={cn('text-accent dark:text-primary')} />
                    <Car size={isMobile ? 10 : 18} className={cn(result.origin_distance / 1000 > 5 ? 'text-accent dark:text-primary' : 'text-gray-300 dark:text-gray-700')} />
                    <Car size={isMobile ? 10 : 18} className={cn(result.origin_distance / 1000 > 10 ? 'text-accent dark:text-primary' : 'text-gray-300 dark:text-gray-700')} />
                  </div>
                  <div>
                    Approx. <span className='text-accent dark:text-primary'>{Math.floor(result.origin_distance / 1000)} km</span> from departure
                  </div>
                </div>
              </div>
              <div className='flex flex-col'>
                <span className="font-bold text-xs md:text-lg">
                  {result.destination_point.city}
                </span>
                <div className='flex flex-col md:flex-row gap-x-2 items-start md:items-center text-[8px] text-muted-foreground'>
                  <div className='flex gap-x-2 items-center'>
                    <Car size={isMobile ? 10 : 18} className={cn('text-accent dark:text-primary')} />
                    <Car size={isMobile ? 10 : 18} className={cn(result.origin_distance / 1000 > 5 ? 'text-accent dark:text-primary' : 'text-gray-300 dark:text-gray-700')} />
                    <Car size={isMobile ? 10 : 18} className={cn(result.origin_distance / 1000 > 10 ? 'text-accent dark:text-primary' : 'text-gray-300 dark:text-gray-700')} />
                  </div>
                  <div>
                    Approx. <span className='text-accent dark:text-primary'>{Math.floor(result.destination_distance / 1000)} km</span> from destination
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col md:hidden gap-y-2 items-center justify-center px-4'>
            <div>
              <Avatar className='w-16 h-16'>
                <AvatarImage src={result.createdBy.profile_photo ? result.createdBy.profile_photo : ''} />
                <AvatarFallback className='bg-red-400 text-sm'>
                  {result.createdBy.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className='flex flex-col items-center justify-center font-bold gap-x-2 text-sm w-full'>
              <div className='flex text-[8px] items-center'>
                <StarIcon className='w-2 h-2 text-[#EFBF04] fill-current' /> {4.5}
              </div>
              <span className='text-[8px] text-muted-foreground'>
                {`(10 Reviews)`}
              </span>
            </div>
          </div>
        </div>
        <Separator className='w-full' />
        <div className='flex gap-x-8 font-bold items-center text-xs md:text-xl px-4 py-4'>
          <div className=''>
            {new Date(result.departure_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
          </div>
          <div className='flex items-center'>
            <IndianRupee size={isMobile ? 10 : 18} className='font-bold' /> {Math.floor(result.price as unknown as number)}
          </div>
          <div className='flex items-center gap-x-2 text-muted-foreground text-xs md:text-lg'>
            <CarFrontIcon size={isMobile ? 15 : 20} /> MARUTI Breeza RED
          </div>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className='md:flex hidden flex-col items-center justify-center gap-y-4 px-10'>
        <div>
          <Avatar className='md:w-30 md:h-30'>
            <AvatarImage src={result.createdBy.profile_photo ? result.createdBy.profile_photo : ''} />
            <AvatarFallback className='bg-red-400 text-sm'>
              {result.createdBy.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='flex flex-col items-center justify-center font-bold gap-x-2 text-sm w-full'>
          <div className='flex text-[8px] items-center'>
            <StarIcon className='w-2 h-2 md:w-4 md:h-4 text-[#EFBF04] fill-current' /> {4.5}
          </div>
          <span className='text-[8px] md:text-xs text-muted-foreground'>
            {`(10 Reviews)`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SingleSearch