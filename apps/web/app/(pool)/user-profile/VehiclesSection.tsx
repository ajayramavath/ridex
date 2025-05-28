import { useGetUserQuery } from '@/redux/user/userApi'
import { GetUserResponse } from '@ridex/common'
import React from 'react'

const VehiclesSection = ({ user }: { user: GetUserResponse }) => {

  return (
    <div>
      <h1 className='text-sm font-bold mb-4'>Vehicles</h1>
      <div>
        <div className='flex gap-x-2 text-lg font-bold'>
          <span>{(user?.vehicle?.brand)?.toUpperCase() ?? ''}</span>
          <span>{user?.vehicle?.name}</span>
          <span>{user?.vehicle?.color}</span>
        </div>
        <div>
        </div>
      </div>
    </div>
  )
}

export default VehiclesSection