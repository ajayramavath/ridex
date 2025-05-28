// hooks/useSearchPayload.ts
'use client'
import { SearchPayload, SearchPayloadSchema } from '@ridex/common'
import { useSearchParams } from 'next/navigation'

import { useMemo } from 'react'

export function useSearchPayload(): {
  payload?: SearchPayload
  isValid: boolean
} {
  const params = useSearchParams()

  return useMemo(() => {
    const raw = {
      from_lat: parseFloat(params.get('from_lat') ?? ''),
      from_lng: parseFloat(params.get('from_lng') ?? ''),
      to_lat: parseFloat(params.get('to_lat') ?? ''),
      to_lng: parseFloat(params.get('to_lng') ?? ''),
      maxDistanceKm: parseInt(params.get('maxDistanceKm') ?? ''),
      availableSeats: parseInt(params.get('availableSeats') ?? ''),
      departureTime: params.get('departureTime') ?? '',
    }

    const result = SearchPayloadSchema.safeParse(raw)
    if (result.success) {
      return { payload: result.data, isValid: true }
    } else {
      return { payload: undefined, isValid: false }
    }
  }, [params.toString()])

}
