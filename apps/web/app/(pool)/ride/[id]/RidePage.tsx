'use client'
import { useGetRideByIdQuery } from '@/redux/ride/rideApi'
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar';
import { Separator } from '@ridex/ui/components/separator';
import { CarIcon, CircleAlert, IndianRupee, Loader2Icon, MapIcon } from 'lucide-react';
import React from 'react'
import { Rating, Vehicle } from '@ridex/common'
import { StarIcon } from '../../search/Rating';
import { Button } from '@ridex/ui/components/button';
import { useAppSelector } from '@/redux/store/hooks';
import { useRouter } from 'next/navigation';

const RidePage = ({ id }: { id: string }) => {
  const { data: ride, isLoading, isError } = useGetRideByIdQuery(id);
  const router = useRouter()
  const { availableSeats } = useAppSelector(state => state.searchRide);
  if (isLoading) {
    return <div className='h-full w-full items-center justify-center flex'><Loader2Icon className='animate-spin h-5 w-5' /></div>
  }
  if (isError || !ride) {
    return <div className='h-full w-full items-center justify-center flex'>Error</div>
  }

  const getUserRating = (ratingsGot: Rating[]): number | string => {
    const validRatings = ratingsGot.filter(rating =>
      typeof rating?.score === 'number' &&
      !isNaN(rating.score) &&
      rating.score >= 0
    );
    if (validRatings.length === 0) return `0.0`;
    const sum = validRatings.reduce((total, rating) => total + rating.score, 0);
    const average = sum / validRatings.length;
    return parseFloat(average.toFixed(1));
  }

  const getVehicleName = (vehicles: Vehicle[]): string => {
    if (vehicles.length === 0) return 'No Vehicle Information';
    if (vehicles[0]) {
      return `${(vehicles[0].brand)} ${vehicles[0].name} - ${vehicles[0].color}`;
    }
    return 'No Vehicle Information';
  }

  const handleOpenMaps = (placeId: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const departureDate = new Date(ride.departure_time)
  const currentDate = new Date()

  // Check if ride is in the future
  const isFutureRide = departureDate > currentDate


  return (
    <div className='flex flex-col grow gap-y-4 p-10'>
      <div className='text-2xl font-bold flex gap-x-4'>
        {new Date(ride.departure_time).toDateString()}
        <span>{new Date(ride.departure_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</span>
      </div>
      <div className='flex gap-x-2'>
        <div className='flex flex-col grow gap-y-4'>
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
          <div className='w-full bg-card rounded-md flex flex-col gap-y-4 py-4 px-8'>
            <div className='text-lg font-bold'>Posted By</div>
            <div
              onClick={() => router.push(`/user/${ride.createdBy.id}`)}
              className='w-full flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded-md'>
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
                  <StarIcon className='h-4 w-4' /> {getUserRating(ride.createdBy.ratingsGot)} / 5 - {ride.createdBy.ratingsGot.length} Ratings
                </span>
              </div>
            </div>
            <Separator className='my-0' />
            <div className='text-lg flex gap-x-2 font-bold text-muted-foreground'>
              <CarIcon />
              {getVehicleName(ride.createdBy.vehicles)}
            </div>
          </div>
          <div className='w-full bg-card rounded-md flex flex-col gap-y-4 py-4 px-8'>
            <div className='text-lg font-bold'>Passengers</div>
            {ride.passenger.length === 0 && <div className='text-muted-foreground'>No passengers yet</div>}
            {ride.passenger.map(passenger => {
              return (
                <div className='w-full flex items-center hover:bg-gray-200 cursor-pointer rounded-md'>
                  <div className='p-4 rounded-md'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage src={passenger.user.profile_photo ? passenger.user.profile_photo : ''} />
                      <AvatarFallback className='bg-red-400 text-sm'>
                        {passenger.user.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    {passenger.user.name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
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
              <Separator className='my-0' />
              <div className='flex justify-around items-center font-bold'>
                <span> {availableSeats} passenger</span>
                <span className='flex items-center'>
                  <IndianRupee size={15} />{Math.floor((ride.price as unknown as number) * availableSeats)}
                </span>
              </div>
              <Separator className='my-0' />
              {isFutureRide ? (
                <Button
                  variant='outline'
                  className='bg-accent/20 text-accent dark:bg-primary/20 dark:text-primary shadow-none'
                >
                  Join Ride
                </Button>
              ) : (
                <Button
                  variant='outline'
                  disabled
                  icon={<CircleAlert />}
                >
                  Ride Already Departed
                </Button>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RidePage