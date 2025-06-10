'use client'
import React, { useState } from 'react'
import CreateButton, { BackButton } from './CreateButton'
import { Input } from '@ridex/ui/components/input'
import { IndianRupee, IndianRupeeIcon, Loader2Icon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks'
import { setPrice } from '@/redux/createRide/createRideSlice'
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'
import { cn } from '@ridex/ui/lib/utils'

const PriceForm = () => {
  const { price, ride_distance_m } = useAppSelector(state => state.createRide)
  const dispatch = useAppDispatch()
  const [error, setError] = useState<string | null>(null)

  console.log(ride_distance_m)

  const validatePrice = () => {
    if (price === null || price === undefined || isNaN(price)) {
      setError('Price is required')
      return false
    }
    if (price <= 0) {
      setError('Price must be greater than 0')
      return false
    }
    if (price > 10000) {
      setError('Price cannot exceed ₹10,000')
      return false
    }
    setError(null)
    return true
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      dispatch(setPrice(NaN))
      return
    }
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      setError('Invalid price')
      return
    }
    const numericValue = parseFloat(value)
    if (numericValue < 0) {
      return
    }
    setError(null)
    dispatch(setPrice(numericValue))
  }

  function estimateRideCosts(
    distanceM: number,
    fuelCostPerLiter = 100,
    mileageKmPerLiter = 15
  ): {
    ratePerKm: number;
    estimatedCost: number;
    suggestions: [number, number];
  } {
    const ratePerKm = fuelCostPerLiter / mileageKmPerLiter;
    const estimatedCost = ((distanceM / 1000) * ratePerKm) / 3;
    const suggestions: [number, number] = [
      Math.floor(estimatedCost),
      Math.floor(estimatedCost + 50),
    ];
    return { ratePerKm, estimatedCost, suggestions };
  }

  return (
    <div className={cn('flex h-full items-center md:py-10 px-4 pt-2 flex-col gap-y-10')}>
      <h1 className='text-lg md:text-3xl font-bold relative w-full flex justify-center'>
        How much is the trip?
        <div className='absolute left-0 top-0'>
          <BackButton />
        </div>
      </h1>
      <div className='w-full md:w-1/3 flex flex-col gap-y-1'>
        <Input
          placeholder='Enter price'
          icon={<IndianRupee size={16} />}
          value={price ? price.toString() : ''}
          className='!rounded-md hover:bg-gray-100 !bg-sidebar text-ellipsis w-full text-left'
          onChange={handlePriceChange}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        <p className="mt-1 text-sm text-gray-500 flex items-center">
          {!ride_distance_m ? (null) : (
            <>Suggested price: <IndianRupeeIcon size={12} className='ml-1' /> {estimateRideCosts(ride_distance_m).suggestions[0]} -
              <IndianRupeeIcon size={12} className='ml-' />{estimateRideCosts(ride_distance_m).suggestions[1]}</>
          )}
        </p>
      </div>
      <CreateButton validate={validatePrice} />
    </div>
  )
}

export default PriceForm