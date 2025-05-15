'use client'
import { useAppSelector } from '@/redux/store/hooks'
import React from 'react'
import SingleSearch from './SingleSearch'
import { useSearchRideMutation } from '@/redux/searchRide/searchRideApi'
import { toast } from '@ridex/ui/components/sonner'
import { Skeleton } from '@ridex/ui/components/skeleton'

const NoResultsComponent = () => (
  <div className="text-center py-12">
    <h3 className="text-xl font-medium mb-2">No rides found</h3>
    <p className="text-muted-foreground">
      Try adjusting your search criteria or check back later
    </p>
  </div>
);

const SearchResults = () => {
  const [searchRide, { data: searchResults, isLoading, isError }] = useSearchRideMutation({
    fixedCacheKey: "searchRideResults"
  })
  if (isLoading) {
    return (
      <div className='flex flex-col gap-y-4'>
        <Skeleton className='h-[220px] w-full bg-card dark:bg-card/30' />
        <Skeleton className='h-[220px] w-full bg-card dark:bg-card/30' />
        <Skeleton className='h-[220px] w-full bg-card dark:bg-card/30' />
      </div>
    )
  }

  if (!searchResults?.results || searchResults.results.length === 0) {
    return <NoResultsComponent />;
  }

  return (
    <div>
      {searchResults?.results.map((result) => {
        return (
          <SingleSearch key={result.id} result={result} />
        )
      })}
    </div>
  )
}

export default SearchResults
