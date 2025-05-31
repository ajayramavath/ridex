'use client'
import React from 'react'
import Search from '@/components/search'
import SearchResults from './SearchResults'
import { useSearchRidesQuery } from '@/redux/searchRide/searchRideApi'
import Hero from '@/components/Hero'
import { cn } from '@ridex/ui/lib/utils'
import MobileSearch from '@/components/MobileSearch/MobileSearch'
import { useSearchPayload } from '@/hooks/useSearchPayload'
import { FilterIcon } from 'lucide-react'
import { Button } from '@ridex/ui/components/button'

const SearchPage = () => {
  const { payload, isValid } = useSearchPayload()
  const { data: searchResults, isLoading, isError, isUninitialized } = useSearchRidesQuery(payload ?? ({} as any), { skip: !isValid })

  if (isUninitialized) {
    return (
      <div className='w-full h-full'>
        <Hero />
      </div>
    );
  }

  return (
    <div className={cn('w-full h-full flex flex-col items-start gap-y-4 overflow-hidden')}>
      <div className='w-full hidden md:flex gap-x-2 items-center justify-center'>
        <Search />
        <Button
          size="lg"
          className='bg-accent/20 text-lg text-accent dark:bg-primary/20 dark:text-primary shadow-none'
          variant="outline"
        >
          <FilterIcon />
        </Button>
      </div>
      <div className='w-full md:hidden'>
        <MobileSearch />
      </div>
      <div className='w-full'>
        <SearchResults data={searchResults?.data} isLoading={isLoading} isError={isError} />
      </div>
    </div>
  )
}

export default SearchPage