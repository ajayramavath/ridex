'use client'
import React, { useEffect, useState } from 'react'
import Search from '@/components/search'
import SearchResults from './SearchResults'
import { useSearchRideMutation } from '@/redux/searchRide/searchRideApi'
import Hero from '@/components/Hero'
import FilterComponent from './FilterComponent'
import { Separator } from '@ridex/ui/components/separator'
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'
import { cn } from '@ridex/ui/lib/utils'
import MobileSearch from '@/components/MobileSearch/MobileSearch'

const SearchPage = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchRide, { data: searchResults, isLoading, isError, isUninitialized }] = useSearchRideMutation({
    fixedCacheKey: "searchRideResults"
  })
  const { isMobile } = useMediaQuery()

  useEffect(() => {
    if (!isUninitialized) {
      setHasSearched(true);
    }
  }, [isUninitialized]);

  if (!hasSearched) {
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
        <SearchResults />
      </div>
    </div>
  )
}

export default SearchPage