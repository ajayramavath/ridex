'use client'
import React from 'react'
import PassengerInput from './components/PassengerInput'
import { SearchIcon } from 'lucide-react'
import { Button } from '@ridex/ui/components/button'
import DateInput from './components/DateInput'
import AutoCompleteInput from '../AutoCompleteInput'
import { useLazySearchRidesQuery } from '@/redux/searchRide/searchRideApi'
import { useAppSelector } from '@/redux/store/hooks'
import { useRouter } from 'next/navigation'


const Search = ({ onSearchComplete }: { onSearchComplete?: () => void }) => {
  const router = useRouter()
  const { departure, destination, departureDate, availableSeats } = useAppSelector(state => state.searchRide)
  const [, { isLoading }] = useLazySearchRidesQuery()

  const handleSearch = async () => {
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
    if (onSearchComplete) onSearchComplete();
    router.push(`/search?${params.toString()}`)
  }
  return (
    <div className='grid grid-cols-1 space-y-1 md:space-y-0 w-full md:grid-cols-3 lg:grid-cols-[1.5fr_1.5fr_1fr_1fr_0.5fr] '>
      <div>
        <AutoCompleteInput type="searchDeparture" placeholder='Leave from' />
      </div>
      <div>
        <AutoCompleteInput type="searchDestination" placeholder='Going to' />
      </div>
      <div>
        <DateInput />
      </div>
      <div>
        <PassengerInput />
      </div>
      <Button
        size="lg"
        variant="outline"
        icon={<SearchIcon />}
        className='my-5 md:my-1 md:h-auto bg-accent/20 text-accent dark:bg-primary/20 dark:text-primary shadow-none'
        onClick={handleSearch}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Search
      </Button>
    </div>
  )
}

export default Search