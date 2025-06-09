import { RideSearch } from '@ridex/common'
import { Separator } from '@ridex/ui/components/separator'
import React from 'react'

const PassengersSection = () => {

  return (
    <div className='w-full flex flex-col bg-card rounded-lg p-2'>
      <div className='text-sm md:text-lg font-semibold p-2'>
        Passengers
      </div>
      <Separator />
      <div className='grow flex items-center justify-center my-2'>
        <div className='text-muted-foreground'>
          No passengers yet
        </div>
      </div>
    </div>
  )
}

export default PassengersSection