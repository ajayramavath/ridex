import { PlaceDetails } from '@/actions/getPlaceDetails';
import { formatTimeAmPm, openGoogleMapsAt, openGoogleMapsPlace } from '@/lib/utils';
import { cn } from '@ridex/ui/lib/utils';
import { Loader, MapIcon, MapPin } from 'lucide-react';
import React from 'react'

export interface LocationDataProps {
  isLoadingPickup?: boolean;
  isLoadingDropoff?: boolean;
  pickupAddrCity: string | undefined;
  dropoffAddrCity: string | undefined;
  pickupAddrFull: string | undefined;
  dropoffAddrFull: string | undefined;
  pickupPlaceId: string | undefined;
  dropoffPlaceId: string | undefined;
  pickupTime: Date | null;
  dropoffTime: Date | null;
  duration: number;
}

const LocationData = ({ locationData, ridePage = false }: { locationData: LocationDataProps, ridePage?: boolean }) => {
  const {
    isLoadingPickup = false,
    isLoadingDropoff = false,
    pickupAddrCity,
    pickupAddrFull,
    dropoffAddrCity,
    dropoffAddrFull,
    pickupPlaceId,
    dropoffPlaceId,
    pickupTime,
    dropoffTime,
    duration
  } = locationData

  const minutes = Math.floor(duration / 60);
  const hours = Math.floor(minutes / 60);
  const min = minutes % 60;
  const durationText = `${hours}hr ${min}min`;

  return (
    <div className="flex items-center w-full p-2 md:px-4 md:py-2">
      <div className='self-stretch flex flex-col items-center mx-2 md:mx-4 md:py-2 '>
        <div className='w-2 h-2 bg-red-400 rounded-full' />
        <div className='grow w-px border-dashed border-gray-300 border-1' />
        <div className='text-[8px] text-wrap max-w-[20px] text-center'>{durationText}</div>
        <div className='grow w-px border-dashed border-gray-300 border-1' />
        <MapPin className='h-4 w-4 text-green-500' />
      </div>
      <div className='grow space-y-6 w-full'>
        <div className="flex-1 flex w-full items-center justify-between">
          <div className='grow'>
            <p className='text-[8px] md:text-xs'>Pickup:</p>
            {isLoadingPickup || !pickupAddrCity || !pickupAddrFull ? (
              <Loader className='animate-spin h-5 w-5' />
            ) : (
              <>
                <p className="font-medium text-xs md:text-lg flex items-center gap-x-2">{pickupAddrCity}
                  <MapIcon
                    size={15}
                    className='text-blue-500 cursor-pointer'
                    onClick={() => {
                      if (pickupPlaceId) openGoogleMapsPlace(pickupPlaceId);
                    }}
                  /></p>
                <p className={cn("text-muted-foreground text-[10px] md:text-base",
                  ridePage ? "block" : "hidden md:block"
                )} >
                  {pickupAddrFull}
                </p>
              </>
            )}
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground text-nowrap">
            Est. Pick Up: <span className='font-bold text-foreground'>{formatTimeAmPm(pickupTime)}</span>
          </p>
        </div>
        <div className="flex-1 w-full flex items-center justify-between">
          <div className='grow'>
            <p className='text-[8px] md:text-xs'>Dropoff:</p>
            {isLoadingDropoff || !dropoffAddrCity || !dropoffAddrFull ? (
              <Loader className='animate-spin h-5 w-5' />
            ) : (
              <>
                <p className="font-medium text-xs md:text-lg flex items-center gap-x-2">{dropoffAddrCity}
                  <MapIcon
                    size={15}
                    className='text-blue-500 cursor-pointer'
                    onClick={() => {
                      if (dropoffPlaceId) openGoogleMapsPlace(dropoffPlaceId);
                    }}
                  /></p>
                <p className={cn("text-muted-foreground text-[10px] md:text-base",
                  ridePage ? "block" : "hidden md:block"
                )} >{dropoffAddrFull}</p>
              </>)}
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground text-nowrap">
            Est. Drop off: <span className='font-bold text-foreground'>{formatTimeAmPm(dropoffTime)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LocationData