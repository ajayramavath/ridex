'use client';

import {
  Star,
  MapPin,
  IndianRupee,
  Dot,
  ArrowUpRight,
  CarIcon,
  MapIcon,
  Loader,
} from 'lucide-react';

import { RideSearch } from '@ridex/common';
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar';

import { Separator } from '@ridex/ui/components/separator';
import { Button } from '@ridex/ui/components/button';
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery';
import { useAppSelector } from '@/redux/store/hooks';
import { useRouter } from 'next/navigation';
import { formatTimeAmPm, openGoogleMapsAt } from '@/lib/utils';
import { useAddress } from '@/hooks/useAddress';
import LocationData from '@/components/LocationData';

export function RideSearchCard({ result }: { result: RideSearch }) {
  const { segment, creator, departurePoint, destinationPoint, ride } = result;
  const { address: pickupAddr, isLoading: isLoadingPickup } = useAddress(segment.pickup.lat, segment.pickup.lng)
  const { address: dropoffAddr, isLoading: isLoadingDropoff } = useAddress(segment.dropoff.lat, segment.dropoff.lng)

  const { isMobile } = useMediaQuery()
  const router = useRouter()

  const { departure, destination, departureDate, availableSeats } = useAppSelector(state => state.searchRide)

  const handleClick = () => {
    if (!departure || !destination || !departureDate || !availableSeats) return
    const params = new URLSearchParams({
      from_lat: (departure.latitude).toString(),
      from_lng: (departure.longitude).toString(),
      to_lat: (destination.latitude).toString(),
      to_lng: (destination.longitude).toString(),
      departureTime: (departureDate).toString(),
      availableSeats: availableSeats.toString(),
      maxDistanceKm: "20"
    })
    router.push(`/ride/${result.ride.id}?${params.toString()}`)
  }

  const minutes = Math.floor(segment.duration_s / 60);
  const hours = Math.floor(minutes / 60);
  const min = minutes % 60;
  const durationText = `${hours}hr ${min}min`;

  const initials = creator.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();


  return (
    <div className="bg-card rounded-md cursor-pointer" onClick={handleClick}>
      <div className='flex items-center justify-between p-2 md:p-4'>
        <div className='flex items-center grow px-2 md:px-6'>
          <div>
            <h2 className="text-xs md:text-base font-semibold">
              {departurePoint.city} → {destinationPoint.city.split(',')[0]}
            </h2>
            <p className="text-[10px] md:text-xs font-semibold">
              {new Date(ride.departureTime).toDateString()}
              <span className='mx-2'>{formatTimeAmPm(ride.departureTime)}</span>
            </p>
          </div>
          <div><Dot /></div>
          {creator.vehicle && (
            <div className='flex flex-col md:flex-row text-[10px] md:text-sm items-center md:gap-x-2'>
              <CarIcon className='hidden md:block' />
              <p>{creator.vehicle.brand}</p>
              <div className='flex items-center gap-x-1'>
                <p>{creator.vehicle.name}</p>
                <p>({creator.vehicle.color})</p>
              </div>
            </div>
          )}
        </div>
        <div>
          <Button
            variant="link"
            className='text-[8px] md:text-sm text-accent dark:text-primary'
            icon={!isMobile ? <ArrowUpRight /> : null}
          >
            View full ride
          </Button>
        </div>
      </div >
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
      />
      <Separator />
      <div className="flex items-center justify-between p-2 md:px-6 md:py-4">
        <div className="flex items-center space-x-2 grow">
          <Avatar className='md:w-12 md:h-12 w-10 h-10'>
            {creator.photo ? (
              <AvatarImage src={creator.photo} alt={creator.name} />
            ) : (
              <AvatarFallback className='bg-red-400 text-sm'>{initials}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className='text-xs md:text-sm font-bold'>{creator.name}</p>
            <div className="flex items-center space-x-1 text-[10px] md:text-xs text-muted-foreground">
              <Star size={10} className='text-yellow-500' />
              <span>{creator.avgRating.toFixed(1)}</span>
              <span>· {creator.totalReviews} reviews</span>
            </div>
          </div>
        </div>
        <div className='flex items-center space-x-2 md:space-x-4'>
          <p className="text-[8px] md:text-sm text-accent dark:text-primary font-medium">
            {ride.availableSeats} seat(s) available
          </p>
          <div className="text-right">
            <p className="text-xs md:text-xl font-bold flex items-center dark:text-primary"><IndianRupee size={15} /> {segment.price.toFixed(2)}</p>
            <p className="text-[8px] md:text-xs dark:text-primary">/ passenger</p>
          </div>
        </div>
      </div>
    </div >
  );
}
