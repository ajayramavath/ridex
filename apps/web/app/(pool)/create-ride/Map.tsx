'use client'
import { useMap } from '@/hooks/useMap'
import Image from 'next/image'
import React from 'react'

const Map = ({ type }: { type: "departure" | "destination" }) => {
  const { mapRef, centerMarkerRef } = useMap(type)

  return (
    <div className='w-full h-full relative'>
      <div ref={mapRef} className='w-full h-full cursor-grab'></div>
      <div
        ref={centerMarkerRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10"
      >
        <div
          className="relative 3s ease-in-out animate-float repeat-infinite"
          style={{
            willChange: 'transform' // Optimize for animation
          }}
        >
          <Image
            src="/images/placeholder.png"
            alt="Map marker"
            width={28}
            height={28}
          />
        </div>
      </div>
    </div>
  )
}

export default Map