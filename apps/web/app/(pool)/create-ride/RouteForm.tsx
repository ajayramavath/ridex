'use client'
import { cn } from '@ridex/ui/lib/utils'
import React from 'react'
import CreateButton, { BackButton } from './CreateButton'
import RouteMap from './RouteMap'
import { useRouteMap } from '@/hooks/useRouteMap'
import { RadioGroup, RadioGroupItem } from '@ridex/ui/components/radio-group'
import { Label } from '@ridex/ui/components/label'
import { ScrollArea } from '@ridex/ui/components/scroll-area'

const RouteForm = () => {

  const { mapRef, routes, selectedRouteIndex, setSelectedRouteIndex } = useRouteMap()

  const getTime = (duration: string) => {
    if (duration.endsWith('s')) duration.slice(0, -1)
    const seconds = parseInt(duration)
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    return `${hours}h ${minutes}m`;
  }

  return (
    <div className={cn('flex md:flex-row flex-col h-full w-full justify-between items-center md:gap-y-10')}>
      <div className='flex w-full md:w-1/3 flex-col md:h-full justify-between items-center gap-y-4 md:gap-y-10 px-2 pb-4 md:py-10'>
        <h1 className='text relative text-lg md:text-2xl font-bold w-full flex justify-center'>
          Select a Route
          <div className='absolute left-0 top-0'>
            <BackButton />
          </div>
        </h1>
        <RadioGroup
          value={`${selectedRouteIndex}`}
          onValueChange={(value) => {
            if (value === '0') setSelectedRouteIndex(0)
            if (value === '1') setSelectedRouteIndex(1)
            if (value === '2') setSelectedRouteIndex(2)
          }}
          className='self-start flex flex-row justify-around md:justify-start md:flex-col w-full grow px-2 md:px-10'
        >
          {routes.map((route, index) => (
            <div key={route.description + index} className="flex items-center md:my-4 space-x-4 cursor-pointer">
              <RadioGroupItem
                className='bg-card dark:bg-card border-card-foreground'
                key={index + route.description} value={`${index}`} id={route.description + index} />
              <Label className='flex text-xs md:text-base flex-col items-start md:gap-y-2 font-bold cursor-pointer' htmlFor={route.description + index} >
                {getTime(route.duration)}
                <span className='text-[8px] flex flex-col md:flex-row md:text-xs text-muted-foreground'>
                  {(route.distanceMeters / 1000).toFixed(0)} km -
                  <span>{route.description}</span>
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className='md:block hidden'>
          <CreateButton />
        </div>
      </div>
      <div
        className={cn('h-full grow bg-black w-full md:w-2/3',)}>
        <RouteMap mapRef={mapRef} />
      </div>
      <div className='md:hidden my-2'>
        <CreateButton />
      </div>
    </div>
  )
}

export default RouteForm