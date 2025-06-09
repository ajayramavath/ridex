import LocationData from '@/components/LocationData';
import { formatTimeAmPm } from '@/lib/utils';
import { useGetRideByIdQuery } from '@/redux/ride/rideApi';
import { Button } from '@ridex/ui/components/button';
import { Separator } from '@ridex/ui/components/separator';
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery';
import { Loader2Icon } from 'lucide-react';
import React from 'react'
import UserSection from './UserSection';
import VehicleSection from './VehicleSection';
import PassengersSection from './PassengersSection';
import CheckoutSection from './CheckoutSection';

const FullRide = ({ id }: { id: string }) => {

  const { data: ride, isLoading, isError } = useGetRideByIdQuery(id);
  const { isMobile } = useMediaQuery()

  if (isLoading) {
    return <div className='h-full w-full items-center justify-center flex'>
      <Loader2Icon className='animate-spin' />
    </div>
  }

  if (isError || !ride) {
    return <div className='h-full w-full items-center justify-center flex'>Ride not found</div>
  }

  const { departure_point, destination_point, departure_time, duration_s, createdBy } = ride
  const { vehicle } = createdBy

  function calculateDropoffTime(pickupTime: Date | null, durationSeconds: number): Date | null {
    if (!pickupTime) return null;
    return new Date(pickupTime.getTime() + durationSeconds * 1000);
  }

  function calculateAvgRating(ratings: any[]): number | string {
    if (!ratings) return 0;
    const avg = ratings.reduce((total, rating) => total + rating.score, 0);
    return avg / ratings.length;
  }

  return (
    <div className='flex flex-col md:p-4 px-4'>
      <div className='p-2 md:py-4 md:px-2 w-full flex items-center justify-between'>
        <h2 className='text-md md:text-xl flex md:flex-row flex-col font-semibold'>
          {new Date(ride.departure_time).toDateString()}
          <span className='mx-2'>{formatTimeAmPm(ride.departure_time)}</span>
        </h2>
        <Button
          size={isMobile ? "sm" : "lg"}
          variant="outline"
          className='text-accent bg-accent/20 dark:text-primary dark:bg-primary/20 shadow-none border-none'
        >
          Join Ride
        </Button>
      </div>
      <div className='my-2 md:my-4 w-full flex md:flex-row flex-col gap-y-2 md:gap-x-4'>
        <div className='w-full md:w-3/4 p-2 border grow rounded-lg flex flex-col bg-card'>
          <header className='flex items-center justify-between w-full px-2 md:p-2'>
            <h2 className='text-sm md:text-lg font-semibold'>Ride Details</h2>
            <Button
              className='text-[10px] px-0 md:text-base text-accent dark:text-primary'
              variant='link'>Preview route</Button>
          </header>
          <Separator />
          <LocationData
            ridePage={true}
            locationData={{
              pickupAddrCity: departure_point.city,
              pickupAddrFull: departure_point.full_address,
              dropoffAddrCity: destination_point.city,
              dropoffAddrFull: destination_point.full_address,
              pickupPlaceId: departure_point.place_id,
              dropoffPlaceId: destination_point.place_id,
              duration: duration_s,
              pickupTime: departure_time,
              dropoffTime: calculateDropoffTime(new Date(departure_time), duration_s)
            }}
          />
        </div>
        <div className='w-full md:w-1/4'>
          <UserSection
            props={{
              name: createdBy.name,
              photo: createdBy.profile_photo,
              avgRating: ride.avgRating,
              totalReviews: ride.totalReviews
            }}
          />
        </div>
      </div>
      <div className='w-full flex md:flex-row flex-col gap-y-2 md:gap-x-4 my-2'>
        <div className='w-full md:w-3/4 flex flex-col md:flex-row gap-y-2 md:gap-x-4'>
          <div className='w-full md:w-1/2 flex items-center'>
            <VehicleSection vehicle={{
              name: vehicle?.name,
              brand: vehicle?.brand,
              color: vehicle?.color,
              photo1: vehicle?.photo1,
              photo2: vehicle?.photo2
            }} />
          </div>
          <div className='flex w-full md:w-1/2'>
            <PassengersSection />
          </div>
        </div>
        <div className='w-full md:w-1/4'>
          <CheckoutSection price={{ totalFare: ride.price as unknown as number }} />
        </div>
      </div>
    </div>
  )
}

export default FullRide