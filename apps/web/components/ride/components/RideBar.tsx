import { formatTimeAmPm } from '@/lib/utils';
import { RideSearch } from '@ridex/common'
import { Button } from '@ridex/ui/components/button';
import { cn } from '@ridex/ui/lib/utils';
import { ArrowUpRight, MoveRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const RideBar = ({ ride }: { ride: RideSearch }) => {
  const router = useRouter()
  const [hovered, setHovered] = useState(false);
  const { departurePoint, destinationPoint, ride: searchRide } = ride;

  return (
    <div
      onClick={() => router.push(`/ride/${ride.ride.id}`)}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      className={cn('flex grow rounded-lg bg-accent/20 text-accent dark:text-primary dark:bg-primary/20 border-accent/20 dark:border-primary/20 items-center justify-between p-2 md:py-4 md:px-2 transition-all cursor-pointer',
        hovered ? "transition-all ring-1 ring-accent/50 dark:ring-primary/50" : "")}>
      <div className='grow px-2 md:px-6'>
        <h2 className="text-sm flex md:text-base gap-x-2 items-center font-semibold">
          {departurePoint.city}
          <MoveRight size={18} />
          {destinationPoint.city.split(',')[0]}
        </h2>
        <p className="text-xs md:text-sm font-semibold">
          {new Date(searchRide.departureTime).toDateString()}
          <span className='mx-2'>{formatTimeAmPm(searchRide.departureTime)}</span>
        </p>
      </div>
      <div>
        <Button
          variant="link"
          className={cn('text-[10px] md:text-sm text-accent dark:text-primary',
            'transition-all', hovered ? "translate-y-[-5px] translate-x-[2px] " : ''
          )}
        >
          View full ride<ArrowUpRight />
        </Button>
      </div>
    </div>
  )
}

export default RideBar