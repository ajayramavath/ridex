'use client'
import { setDepartureTime } from '@/redux/createRide/createRideSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { Calendar } from '@ridex/ui/components/calendar';
import { Input } from '@ridex/ui/components/input'
import { Popover, PopoverContent, PopoverTrigger } from '@ridex/ui/components/popover';
import { Calendar as CalenderIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import CreateButton, { BackButton } from './CreateButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ridex/ui/components/select";
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery';
import { cn } from '@ridex/ui/lib/utils';

const DateForm = () => {
  const dispatch = useAppDispatch()
  const { departureTime } = useAppSelector(state => state.createRide)
  const { isMobile } = useMediaQuery()

  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentDate = departureTime ? new Date(departureTime) : new Date();
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;

    const newDate = new Date(date);
    newDate.setHours(currentHours);
    newDate.setMinutes(currentMinutes);

    dispatch(setDepartureTime(newDate));
    setOpen(false);
  };

  const handleTimeChange = (timeValue: string) => {
    const [time, period] = timeValue.split(' ');
    if (!time) return;
    const [hoursStr, minutesStr] = time.split(':');
    if (!hoursStr || !minutesStr) return;
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const newDate = new Date(currentDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    dispatch(setDepartureTime(newDate));
  };

  const timeOptions = Array.from({ length: 24 * 4 }).map((_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return {
      value: `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`,
      hours,
      minutes
    };
  });

  const currentDisplayHours = currentHours % 12 || 12;
  const currentPeriod = currentHours >= 12 ? 'PM' : 'AM';
  const currentTimeString = `${currentDisplayHours}:${currentMinutes.toString().padStart(2, '0')} ${currentPeriod}`;

  return (
    <div className={cn('flex h-full items-center md:py-10 pt-2 px-4 flex-col gap-y-4 md:gap-y-10')}>
      <h1 className='text-lg md:text-3xl font-bold relative w-full flex justify-center'>
        When would you like to pick up?
        <div className='absolute left-0 top-0'>
          <BackButton />
        </div>
      </h1>
      <div className='flex flex-col gap-y-4 w-full items-center'>
        <h1 className='text-2xl font-semibold'>
          Select Date
        </h1>
        <div className='w-full md:w-1/4'>
          <Popover open={open}>
            <PopoverTrigger asChild>
              <Input
                icon={<CalenderIcon size={20} />}
                inputSize="lg"
                placeholder='Pick a date'
                className='!rounded-md hover:bg-gray-100 !bg-sidebar text-ellipsis w-full text-left font-semibold'
                value={departureTime ? new Date(departureTime).toDateString() : new Date().toDateString()}
                readOnly
                onClick={() => setOpen(true)}
              />
            </PopoverTrigger>
            <PopoverContent className='p-0 w-auto' align='start'>
              <div ref={popoverRef}>
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleDateChange}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className='flex flex-col gap-y-4 w-full items-center'>
        <h1 className='text-2xl font-semibold w-full flex justify-center'>
          Select time
        </h1>
        <div className=' w-full md:w-1/4'>
          <Select value={currentTimeString} onValueChange={handleTimeChange}>
            <SelectTrigger className='!rounded-md hover:bg-gray-100 !bg-sidebar text-ellipsis w-full text-left font-semibold'>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className='max-h-80 font-semibold' align="center">
              {timeOptions.map((time) => (
                <SelectItem
                  key={time.value}
                  value={time.value}
                  className='font-semibold'
                >
                  {time.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <CreateButton />
      </div>
    </div>
  )
}

export default DateForm