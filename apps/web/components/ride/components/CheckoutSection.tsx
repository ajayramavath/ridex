import { RideSearch } from '@ridex/common'
import { Button } from '@ridex/ui/components/button'
import { Separator } from '@ridex/ui/components/separator'
import { IndianRupee } from 'lucide-react'
import React from 'react'

interface CheckoutSectionProps {
  segmentFare?: number;
  totalFare: number;
}

const CheckoutSection = ({ price }: { price: CheckoutSectionProps }) => {
  return (
    <div className='w-full flex flex-col bg-card rounded-lg p-2'>
      <h2 className='text-sm md:text-lg font-semibold p-2'> Checkout</h2>
      <Separator />
      <div className='grow flex flex-col  gap-y-2 my-2 text-sm md:text-base'>
        <div className='grid grid-cols-[2fr_1fr] gap-x-4 items-center'>
          <p className='text-center'>Total Ride Price</p>
          <p className='flex items-center'><IndianRupee size={15} /> {Math.floor(price.totalFare)}</p>
        </div>
        {price.segmentFare && (
          <>
            <Separator />
            <div className='grid grid-cols-[2fr_1fr] gap-x-4 items-center'>
              <p className='text-center'>Your Fare</p>
              <p className='flex items-center'><IndianRupee size={15} /> {Math.floor(price.segmentFare)}</p>
            </div>
          </>
        )}
      </div>
      <Button
        variant="outline"
        className='w-full text-accent bg-accent/20 dark:text-primary dark:bg-primary/20 shadow-none border-none mt-4'>
        Join Ride
      </Button>
    </div>
  )
}

export default CheckoutSection