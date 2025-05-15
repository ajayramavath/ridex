'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@ridex/ui/components/input'
import { Calendar as CalenderIcon } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@ridex/ui/components/popover'
import { Calendar } from '@ridex/ui/components/calendar'
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks'
import { setDate } from '@/redux/searchRide/searchRideSlice'
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'
import { cn } from '@ridex/ui/lib/utils'

const DateInput = () => {
  const dispatch = useAppDispatch()
  const { departureDate } = useAppSelector(state => state.searchRide)
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMediaQuery()

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return 'Pick a date';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((inputDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    switch (diffDays) {
      case 0:
        return 'Today';
      case 1:
        return 'Tomorrow';
      case -1:
        return 'Yesterday';
      default:
        return inputDate.toLocaleDateString();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };


  return (
    <div className='md:p-1'>
      <Popover open={open}>
        <PopoverTrigger asChild>
          <Input
            icon={<CalenderIcon size={isMobile ? 15 : 20} />}
            inputSize={isMobile ? 'md' : 'lg'}
            placeholder='Pick a date'
            className={cn('!rounded-md hover:bg-gray-100 !bg-sidebar text-ellipsis w-full text-left cursor-pointer',
              isMobile ? '!text-xs' : 'text-base'
            )}
            value={formatDisplayDate(departureDate)}
            readOnly
            onClick={() => setOpen(true)}
          />
        </PopoverTrigger>
        <PopoverContent className='p-0 w-auto' align="start">
          <div ref={popoverRef}>
            <Calendar
              mode="single"
              selected={departureDate}
              onSelect={(date) => {
                if (date) {
                  dispatch(setDate(date));
                }
                setOpen(false);
              }}
              disabled={isDateDisabled}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateInput