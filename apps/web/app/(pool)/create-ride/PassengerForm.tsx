'use client'
import React from 'react'
import CreateButton, { BackButton } from './CreateButton'
import { Input } from "@ridex/ui/components/input";
import { MinusIcon, PlusIcon, User } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from '@ridex/ui/components/popover'
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { cn } from '@ridex/ui/lib/utils';
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery';
import { setAvailableSeats } from '@/redux/createRide/createRideSlice';

const PassengerForm = () => {
  const dispatch = useAppDispatch();
  const { availableSeats } = useAppSelector((state) => state.createRide);
  const { isMobile } = useMediaQuery()


  return (
    <div className={cn('flex h-full items-center py-10 px-4 flex-col gap-y-10')}>
      <div className='md:text-3xl font-bold relative w-full flex justify-center'>
        <span className='w-3/4 md:w-full text-center'>How many passengers will be travelling?</span>
        <div className='absolute left-0 top-0'>
          <BackButton />
        </div>
      </div>
      <div className='w-full md:w-1/3'>
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <Input
                icon={<User size={20} />}
                inputSize="lg"
                placeholder='Passengers'
                className='!rounded-md hover:bg-gray-100 !bg-sidebar text-ellipsis w-full text-left'
                readOnly
                value={availableSeats > 1 ? availableSeats + ' passengers' : '1 passenger'}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-sidebar">
            <div className="max-w-sm flex justify-around items-center">
              <MinusIcon
                style={availableSeats === 1 ? { opacity: 0.5, cursor: 'default' } : {}}
                size={20}
                className="cursor-pointer"
                onClick={() => dispatch(setAvailableSeats(Math.max(availableSeats - 1, 1)))} />
              <div className="text-accent dark:text-primary">{availableSeats}</div>
              <PlusIcon
                style={availableSeats === 5 ? { opacity: 0.5, cursor: 'default' } : {}}
                size={20}
                className="cursor-pointer"
                onClick={() => dispatch(setAvailableSeats(Math.min(availableSeats + 1, 4)))} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <CreateButton />
    </div>
  )
}

export default PassengerForm