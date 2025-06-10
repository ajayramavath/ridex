'use client'
import { useGetRideByIdQuery } from '@/redux/ride/rideApi'
import { ArrowUpRight, CarIcon, Dot, Loader2Icon } from 'lucide-react';
import React, { useMemo } from 'react'
import { useSearchPayload } from '@/hooks/useSearchPayload';
import { useSearchRidesQuery } from '@/redux/searchRide/searchRideApi';
import { RideSearch } from '@ridex/common';
import FullRide from './components/FullRide';
import { formatTimeAmPm } from '@/lib/utils';
import { Button } from '@ridex/ui/components/button';
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery';
import RideBar from './components/RideBar';
import SegmentSection from './components/SegmentSection';
import UserSection from './components/UserSection';
import VehicleSection from './components/VehicleSection';
import PassengersSection from './components/PassengersSection';
import CheckoutSection from './components/CheckoutSection';
import { create } from 'domain';

const RidePage = ({ id }: { id: string }) => {
  const { payload, isValid } = useSearchPayload()
  const { isMobile } = useMediaQuery()
  const { data: searchResults, isLoading: isSearching, isError: isSearchError } = useSearchRidesQuery(payload!, { skip: !isValid })

  const searchResultForThisRide = useMemo<RideSearch | undefined>(() => {
    if (!isValid || !searchResults) return undefined;
    return searchResults.data.find((r) => r.ride.id === id);
  }, [isValid, searchResults, id]);

  if (isValid && isSearching) {
    return <div className='h-full w-full items-center justify-center flex'>
      Loading Search data....
    </div>;
  }

  const shouldShowFullRide = !searchResultForThisRide || isSearchError;

  if (shouldShowFullRide) {
    return (
      <FullRide id={id} />
    )
  }

  const { creator, ride, segment } = searchResultForThisRide;
  const { vehicle } = creator

  return (
    <div className='flex flex-col md:p-4 px-4 py-2'>
      <RideBar ride={searchResultForThisRide} />
      <div className='my-2 md:my-4 w-full flex md:flex-row flex-col gap-y-2 md:gap-x-4'>
        <div className='w-full md:w-3/4 flex'>
          <SegmentSection ride={searchResultForThisRide} />
        </div>
        <div className='w-full md:w-1/4'>
          <UserSection
            props={{
              name: creator.name,
              photo: creator.photo,
              avgRating: creator.avgRating,
              totalReviews: creator.totalReviews
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
          <CheckoutSection price={{
            totalFare: ride.price,
            segmentFare: segment.price
          }} />
        </div>
      </div>
    </div>
  )
}

export default RidePage