'use client'
import React, { useEffect, useState } from 'react'
import Search from '@/components/search'
import SearchResults from './SearchResults'
import { useSearchRidesQuery } from '@/redux/searchRide/searchRideApi'
import Hero from '@/components/Hero'
import FilterComponent from './FilterComponent'
import { Separator } from '@ridex/ui/components/separator'
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'
import { cn } from '@ridex/ui/lib/utils'
import MobileSearch from '@/components/MobileSearch/MobileSearch'
import { useSearchParams } from 'next/navigation'
import { SearchPayload } from '@ridex/common'
import { persistor } from '@/redux/store/store'
import { Skeleton } from '@ridex/ui/components/skeleton'
import { useSearchPayload } from '@/hooks/useSearchPayload'

const SearchPage = () => {
  const { payload, isValid } = useSearchPayload()
  const { data: searchResults, isLoading, isError, isUninitialized } = useSearchRidesQuery(payload ?? ({} as any), { skip: !isValid })
  //console.log(isUninitialized, searchResults, isValid, payload)

  if (isUninitialized) {
    return (
      <div className='w-full h-full'>
        <Hero />
      </div>
    );
  }

  return (
    <div className={cn('w-full h-full flex flex-col items-start gap-y-4 overflow-hidden')}>
      <div className='w-full hidden md:block'>
        <Search />
      </div>
      <div className='w-full hidden md:block'>
        <FilterComponent />
      </div>
      <div className='w-full md:hidden'>
        <MobileSearch />
      </div>
      <Separator className='hidden md:block' />
      <div className='w-full'>
        <SearchResults data={searchResults?.data} isLoading={isLoading} isError={isError} />
      </div>
    </div>
  )
}

export default SearchPage