'use client'
import PostedRide from '@/components/Profile/PostedRide';
import { useGetUserByIdQuery } from '@/redux/user/userApi'
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar';
import { Separator } from '@ridex/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ridex/ui/components/tabs';
import { Car, ListCheck, Loader2Icon, Settings, ThumbsUp, User2Icon, Users } from 'lucide-react';
import React from 'react'
import JoinedRides from '../../user-profile/JoinedRides';
import ReviewSection from '../../user-profile/ReviewSection';
import PreferanceSection from '../../user-profile/PreferanceSection';
import VehiclesSection from '../../user-profile/VehiclesSection';
import { GetUserResponse } from '@ridex/common';
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery';
import { cn } from '@ridex/ui/lib/utils';

const TabsTriggerClassName = 'text-xs flex gap-x-2 md:text-sm md:px-4 md:py-4 data-[state=active]:!text-accent dark:data-[state=active]:!text-primary cursor-pointer';

const UserPage = ({ id }: { id: string }) => {
  const { data: user, isLoading, isError } = useGetUserByIdQuery(id);
  const { isMobile } = useMediaQuery()
  if (isLoading) {
    return <div className='h-full w-full items-center justify-center flex'><Loader2Icon className='animate-spin h-5 w-5' /></div>
  }
  if (isError || !user) {
    return <div className='h-full w-full items-center justify-center flex'>Error</div>
  }

  const getUserRating = (user: GetUserResponse): number | string => {
    if (!user?.ratingsGot || !Array.isArray(user.ratingsGot)) return `0.0`;
    const validRatings = user.ratingsGot.filter(rating =>
      typeof rating?.score === 'number' &&
      !isNaN(rating.score) &&
      rating.score >= 0
    );
    if (validRatings.length === 0) return `0.0`;
    const sum = validRatings.reduce((total, rating) => total + rating.score, 0);
    const average = sum / validRatings.length;
    return parseFloat(average.toFixed(1));
  }

  return (
    <div className={cn('flex flex-col justify-between gap-y-4 w-full h-full', isMobile ? 'py-8 px-4' : '')}>
      <div className='flex flex-col md:flex-row gap-y-4 justify-around md:items-center'>
        <div className='flex gap-x-4 md:justify-center pt-8 items-center w-[40%]'>
          <Avatar className="md:h-32 md:w-32 w-16 h-16">
            <AvatarImage src={user?.profile_photo ? user.profile_photo : undefined} alt="Profile" />
            <AvatarFallback className="text-2xl bg-red-400" delayMs={0}>
              <User2Icon />
            </AvatarFallback>
          </Avatar>
          <div className='space-y-2'>
            <div className='text-xl font-bold'>{user?.name}</div>
            <div>{user?.bio}</div>
          </div>
        </div>
        <div className='flex gap-x-4 text-muted-foreground md:gap-x-8 items-center'>
          <div className='flex flex-col md:text-sm text-xs'>
            Rides Posted
            <span className='md:text-xl font-bold'>{user?.posted_rides?.length}</span>
          </div>
          <div className='flex flex-col md:text-sm text-xs'>
            Rides Joined
            <span className='md:text-xl font-bold'>{user?.joined_rides?.length}</span>
          </div>
          <div className='flex flex-col md:text-sm text-xs'>
            Rating
            <span className='md:text-xl font-bold'>{`${getUserRating(user)}`}</span>
          </div>
        </div>
      </div>
      <div>
        <Tabs defaultValue="ridesPosted" className="w-full md:px-8 py-4">
          <TabsList className='bg-background md:px-2'>
            <TabsTrigger
              value="ridesPosted"
              className={cn(TabsTriggerClassName)}
            >
              <ListCheck className='w-5 h-5' />
              <span className='hidden md:block'>Rides Posted</span>
            </TabsTrigger>
            <TabsTrigger
              value="ridesJoined"
              className={cn(TabsTriggerClassName)}
            >
              <Users className='w-5 h-5' />
              <span className='hidden md:block'>Rides Joined</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className={cn(TabsTriggerClassName)}>
              <Settings className='w-5 h-5' />
              <span className='hidden md:block'>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className={cn(TabsTriggerClassName)}>
              <ThumbsUp className='w-5 h-5' />
              <span className='hidden md:block'>Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className={cn(TabsTriggerClassName)}>
              <Car className='w-5 h-5' />
              <span className='hidden md:block'>Vehicles</span>
            </TabsTrigger>
          </TabsList>
          <Separator className='bg-muted-foreground' />
          <TabsContent value="ridesPosted" className='h-full'>
            <h1 className='text-sm font-bold'>Rides Posted</h1>
            {user.posted_rides.length === 0 && <div className='text-muted-foreground'>No rides yet</div>}
            {user.posted_rides.map(ride => {
              return <PostedRide key={ride.id} ride={ride} />
            })}
          </TabsContent>
          <TabsContent value="ridesJoined" className='h-full'>
            <h1 className='text-sm font-bold mb-4'>Rides Joined</h1>
            {user.joined_rides.length === 0 && <div className='text-muted-foreground'>No rides yet</div>}
            {user.joined_rides.map(joined => {
              return <JoinedRides key={joined.id} passenger={joined} />
            })}
          </TabsContent>
          <TabsContent value="reviews" className='h-full'>
            <ReviewSection user={user} />
          </TabsContent>
          <TabsContent value="preferences" className='h-full'>
            <PreferanceSection user={user} />
          </TabsContent>
          <TabsContent value="vehicles" className='h-full'>
            <VehiclesSection user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div >
  )
}

export default UserPage