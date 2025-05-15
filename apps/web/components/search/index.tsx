'use client'
import React from 'react'
import PassengerInput from './components/PassengerInput'
import { SearchIcon } from 'lucide-react'
import { Button } from '@ridex/ui/components/button'
import DateInput from './components/DateInput'
import AutoCompleteInput from '../AutoCompleteInput'
import { useSearchRideMutation } from '@/redux/searchRide/searchRideApi'
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks'
import { SearchPayload } from '@ridex/common'
import { useCreatePointMutation } from '@/redux/createRide/createRideApi'
import { setSearchResults } from '@/redux/searchRide/searchRideSlice'


const Search = ({ onSearchComplete }: { onSearchComplete?: () => void }) => {
  const dispatch = useAppDispatch()
  const { departure, destination, departureDate, availableSeats, departurePointId, destinationPointId } = useAppSelector(state => state.searchRide)
  const [searchRide, { isLoading }] = useSearchRideMutation({
    fixedCacheKey: "searchRideResults"
  })
  const [createPoint, { isLoading: isCreatingPoint }] = useCreatePointMutation({
    fixedCacheKey: "createPoint"
  })

  const handleSearch = async () => {
    if (!departure || !destination || !departureDate || !availableSeats || !departurePointId || !destinationPointId) return
    const payload: SearchPayload = {
      from: departurePointId,
      to: destinationPointId,
      departureTime: departureDate,
      availableSeats,
      maxDistanceKm: 20
    }
    if (onSearchComplete) onSearchComplete();
    try {
      const response = await searchRide(payload).unwrap()
      dispatch(setSearchResults(response))
    } catch (error) {
      console.log(error);
    }
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
        isLoading={isLoading || isCreatingPoint}
        disabled={isLoading || !departurePointId || !destinationPointId}
      >
        Search
      </Button>
    </div>
  )
}

export default Search