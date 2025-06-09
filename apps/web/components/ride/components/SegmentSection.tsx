import LocationData from '@/components/LocationData'
import { useAddress } from '@/hooks/useAddress'
import { formatTimeAmPm, openGoogleMapsAt } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks'
import { RideSearch } from '@ridex/common'
import { Button } from '@ridex/ui/components/button'
import { Separator } from '@ridex/ui/components/separator'
import { Loader, MapIcon, MapPin } from 'lucide-react'
import React, { useEffect } from 'react'

const SegmentSection = ({ ride }: { ride: RideSearch }) => {
  const { segment } = ride
  const { address: pickupAddr, isLoading: isLoadingPickup } = useAddress(segment.pickup.lat, segment.pickup.lng)
  const { address: dropoffAddr, isLoading: isLoadingDropoff } = useAddress(segment.dropoff.lat, segment.dropoff.lng)

  return (
    <div className='p-2 border grow rounded-lg flex flex-col bg-card'>
      <header className='flex items-center justify-between w-full px-2 md:p-2'>
        <h2 className='text-sm md:text-lg font-semibold'>Your Segment</h2>
        <Button
          className='text-[10px] px-0 md:text-base text-accent dark:text-primary'
          variant='link'>Preview route</Button>
      </header>
      <Separator />
      <LocationData
        locationData={{
          isLoadingPickup,
          isLoadingDropoff,
          pickupAddrCity: pickupAddr?.city,
          pickupAddrFull: pickupAddr?.full_address,
          dropoffAddrCity: dropoffAddr?.city,
          dropoffAddrFull: dropoffAddr?.full_address,
          pickupPlaceId: pickupAddr?.place_id,
          dropoffPlaceId: dropoffAddr?.place_id,
          pickupTime: segment.estimated_pickup_time,
          dropoffTime: segment.estimated_dropoff_time,
          duration: segment.duration_s
        }}
        ridePage={true}
      />
    </div>
  )
}

export default SegmentSection