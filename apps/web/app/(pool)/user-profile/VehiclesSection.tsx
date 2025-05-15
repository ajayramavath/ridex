import { useGetUserQuery } from '@/redux/user/userApi'
import { GetUserResponse } from '@ridex/common'
import React from 'react'

const VehiclesSection = ({ user }: { user: GetUserResponse }) => {

  return (
    <div>
      <h1 className='text-sm font-bold mb-4'>Vehicles</h1>
      {user?.vehicles.map(vehicle => {
        return (
          <div key={vehicle.id} >
            <div className='flex gap-x-2 text-lg font-bold'>
              <span>{(vehicle.brand).toUpperCase()}</span>
              <span>{vehicle.name}</span>
              <span>{vehicle.color}</span>
            </div>
            <div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default VehiclesSection