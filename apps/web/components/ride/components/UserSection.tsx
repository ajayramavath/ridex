import { RideSearch } from '@ridex/common'
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar';
import { Button } from '@ridex/ui/components/button';
import { Separator } from '@ridex/ui/components/separator';
import { StarIcon } from 'lucide-react';
import React from 'react'

export interface UserSectionProps {
  name: string;
  photo: string | null;
  avgRating: number;
  totalReviews: number;
}

const UserSection = ({ props }: { props: UserSectionProps }) => {
  const { name, photo, avgRating, totalReviews } = props;
  const initials = name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
  return (
    <div className='p-2 w-full bg-card border rounded-lg flex flex-col items-center'>
      <header className='text-sm md:text-lg relative w-full font-semibold flex items-center justify-between px-2 md:p-2'>
        <h2>Driver</h2>
        <Button
          asChild
          variant='link'
          className='text-accent right-0 absolute text-[10px] px-0 md:text-xs dark:text-primary'
        >
          View profile
        </Button>
      </header>
      <Separator />
      <Avatar className='md:w-32 md:h-32 w-16 h-16 my-2 md:my-4'>
        {photo ? (
          <AvatarImage src={photo} alt={name} />
        ) : (
          <AvatarFallback className='bg-red-400 text-sm'>
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      <p className='font-semibold'>{name}</p>
      <p className='text-muted-foreground text-sm flex items-center justify-center'>
        <StarIcon size={12} className='text-yellow-500' /> {avgRating}
        <span className='mx-2'>({totalReviews} reviews)</span>
      </p>
    </div>
  )
}

export default UserSection