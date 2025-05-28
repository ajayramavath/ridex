'use client'
import { useAppSelector } from '@/redux/store/hooks'
import { Separator } from '@ridex/ui/components/separator'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@ridex/ui/components/drawer'
import { ArrowRight, FilterIcon, SearchIcon } from 'lucide-react'
import React, { useState } from 'react'
import Search from '../search'
import FilterComponent from '@/app/(pool)/search/FilterComponent'
import { Button } from '@ridex/ui/components/button'

const MobileSearch = () => {
  const { departure, destination, departureDate, availableSeats } = useAppSelector(state => state.searchRide)
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className='flex border-2 items-center  w-full p-2 px-4 gap-x-8 rounded-md'>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger >
          <div className='flex items-center grow gap-x-4 cursor-pointer'>
            <div>
              <SearchIcon size={15} />
            </div>
            <div className='flex flex-col'>
              <div className='grid grid-cols-[1fr_0.2fr_1fr] items-center'>
                <div className='overflow-hidden text-nowrap text-xs text-ellipsis'>
                  {departure?.full_address}
                </div>
                <ArrowRight size={15} />
                <div className='overflow-hidden text-nowrap text-xs text-ellipsis'>
                  {destination?.full_address}
                </div>
              </div>
              <div className='flex text-xs text-muted-foreground items-center'>
                <span className=''>{formatDisplayDate(departureDate)} , </span>
                <span>{availableSeats} {availableSeats > 1 ? 'passengers' : 'passenger'}</span>
              </div>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className='h-full'>
          <div className='h-full mx-auto text-center w-full px-4 max-w-sm'>
            <DrawerHeader>
              <DrawerTitle>Search</DrawerTitle>
              <DrawerDescription>Search for rides by entering your departure and destination locations</DrawerDescription>
            </DrawerHeader>
            <Search onSearchComplete={() => setIsOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger>
          <div className='dark:text-primary flex flex-col items-center text-xs text-accent cursor-pointer'>
            <FilterIcon size={15} />
            Filter
          </div>
        </DrawerTrigger>
        <DrawerContent className='h-full'>
          <div className='mx-auto w-full max-w-sm text-center h-full'>
            <DrawerHeader>
              <DrawerTitle>Filter</DrawerTitle>
            </DrawerHeader>
            <FilterComponent />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Apply</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default MobileSearch