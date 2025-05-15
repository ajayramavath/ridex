import { getAuthSession } from '@/lib/authSession'
import { Avatar, AvatarImage, AvatarFallback } from '@ridex/ui/components/avatar'
import React from 'react'

const User = async () => {
  const session = await getAuthSession()
  if (!session || !session.user || !session.user.name) return null
  const name = session.user.name

  const initials = name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();

  return (
    <div className='flex items-center gap-2 py-2 px-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800'>
      <Avatar>
        <AvatarImage />
        <AvatarFallback className='bg-red-400 text-sm'>{initials}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col grow'>
        <div className='text-sm font-bold'>{session.user.name}</div>
        <div className='text-xs max-w-[170px] text-ellipsis overflow-hidden'>
          {session.user.email}
        </div>
      </div>
    </div>
  )
}

export default User