'use client'
import React from 'react'
import SingleSearch from './SingleSearch'
import { RideSearch } from '@ridex/common'
import { Skeleton } from '@ridex/ui/components/skeleton';

const NoResultsComponent = () => (
  <div className="text-center py-12">
    <h3 className="text-xl font-medium mb-2">No rides found</h3>
    <p className="text-muted-foreground">
      Try adjusting your search criteria or check back later
    </p>
  </div>
);

const SearchResults = ({ data, isLoading, isError }: { data?: RideSearch[], isLoading: boolean, isError: boolean }) => {

  if (isLoading) {
    return (
      <div className='flex flex-col gap-y-4'>
        <Skeleton className='h-[220px] w-full bg-card dark:bg-card/30' />
        <Skeleton className='h-[220px] w-full bg-card dark:bg-card/30' />
        <Skeleton className='h-[220px] w-full bg-card dark:bg-card/30' />
      </div>
    )
  }

  if (isError) {
    return <div className='text-red-400'>
      Oh no! Something went wrong. Please try again later.
    </div>
  }

  if (!data || data.length === 0) {
    return <NoResultsComponent />;
  }

  return (
    <div>
      {data.map((result) => {
        return (
          <SingleSearch key={result.id} result={result} />
        )
      })}
    </div>
  )
}

export default SearchResults
