import { GetRideResult } from '@ridex/common'
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar'
import React from 'react'

const PassengerSection = ({ ride }: { ride: GetRideResult }) => {
  return (
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
  )
}

export default PassengerSection