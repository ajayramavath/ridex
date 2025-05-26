import { useRouteMap } from '@/hooks/useRouteMap'
import React from 'react'

const RouteMap = ({ mapRef }: { mapRef: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <div className='w-full h-full relative'>
      <div ref={mapRef} className='w-full h-full cursor-grab'></div>
    </div>
  )
}

export default RouteMap