import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@ridex/ui/components/avatar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@ridex/ui/components/tooltip'
import Logout from '@/components/Logout'
import { Button } from '@ridex/ui/components/button'
import Link from 'next/link'

interface UserAvatarProps {
  photoUrl: string
  name: string
}

const UserAvatar = ({ photoUrl, name }: UserAvatarProps) => {
  const initials = name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip >
        <TooltipTrigger asChild >
          <Avatar className='shadow-sm p-4 bg-primary text-gray-800 cursor-pointer'>
            <AvatarImage src={photoUrl} />
            <AvatarFallback
              className='text-sm'
            >{initials}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent className='w-auto bg-card' sideOffset={5}>
          <div className='flex flex-col gap-1 data-[placement=none]'>
            <Link href={`/profile/rides`}>

            </Link>
            <Logout />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default UserAvatar