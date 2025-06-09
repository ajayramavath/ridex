import { Separator } from '@ridex/ui/components/separator'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ridex/ui/components/carousel"
import { Card, CardContent } from '@ridex/ui/components/card'
import { RideSearch } from '@ridex/common'

export interface VehicleSectionProps {
  name: string | undefined;
  brand: string | undefined;
  color: string | undefined;
  photo1: string | null | undefined;
  photo2: string | null | undefined;
}

const VehicleSection = ({ vehicle }: { vehicle: VehicleSectionProps }) => {

  return (
    <div className='w-full bg-card flex flex-col rounded-lg p-2'>
      <div className='flex items-center justify-between p-2'>
        <p className='text-sm md:text-lg font-semibold'>Vehicle</p>
        <p className='text-sm font-semibold'>
          {(vehicle?.brand)?.toLocaleUpperCase()} - {vehicle?.name} - {vehicle?.color}
        </p>
      </div>
      <Separator />
      <div className='w-full my-2'>
        <Carousel className="w-full flex flex-col justify-center gap-y-2">
          <CarouselContent className=''>
            {Array.from({ length: 2 }).map((_, index) => (
              <CarouselItem key={index} className='w-full'>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex w-full items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{index + 1}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className='w-full mt-4 flex items-center justify-center gap-x-2'>
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  )
}

export default VehicleSection