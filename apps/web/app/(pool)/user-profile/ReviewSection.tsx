import { GetUserResponse } from '@ridex/common'
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar'
import { Separator } from '@ridex/ui/components/separator'
import { useRouter } from 'next/navigation'
import React from 'react'

const ReviewSection = ({ user }: { user: GetUserResponse }) => {
  const router = useRouter()

  if (user?.reviewsGot?.length === 0) {
    return (
      <div
        className='h-full text-xl font-bold w-full flex justify-center items-center'>
        No reviews yet!
      </div>
    )
  }
  return (
    <div className='flex flex-col md:gap-y-4 gap-y-2 px-2 md:p-4'>
      <h1 className='text-sm font-bold'>Reviews</h1>
      {user?.reviewsGot?.map(review => {
        return (
          <div className='flex gap-x-4 mt-2' key={review.id}>
            <div className='flex gap-x-2 items-center'>
              <Avatar className='w-10 h-10'>
                <AvatarImage src={review.author.profile_photo ? review.author.profile_photo : ''} />
                <AvatarFallback className='bg-red-400 text-sm'>
                  {review.author.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                onClick={() => router.push(`/user/${review.author.id}`)}
                className='cursor-pointer hover:underline text-sm '
              >{review.author.name}</div>
            </div>
            <div className='flex flex-col gap--2 items-start'>
              <div className='text-sm md:text-lg'>{review.content}</div>
              <div className='text-xs text-muted-foreground'>{new Date(review.createdAt).toDateString()}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ReviewSection