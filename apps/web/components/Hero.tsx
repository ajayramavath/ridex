'use client'
import React from 'react'
import Search from './search'
import { cn } from '@ridex/ui/lib/utils'
import { useTheme } from 'next-themes'

const Hero = () => {
  const { theme } = useTheme()
  return (
    <div className="mx-auto grow flex flex-col items-center gap-y-8 justify-start px-4 lg:px-8 overflow-hidden">
      {theme === "dark" && (
        <>
          <div
            className={cn(
              "absolute inset-0",
              "[background-size:40px_40px] -z-10",
              "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
              "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
            )}
          />
          <div className="pointer-events-none -z-10 absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-background"></div>
        </>
      )}
      <div className="flex flex-col items-center justify-center md:pt-20 gap-y-4 text-center max-w-7xl">
        <span className="text-5xl md:text-7xl font-bold text-accent/70 dark:text-primary">Share Rides, Save More</span>
        <span className="text-xl md:text-2xl">The Smarter Way to Commute!</span>
        <p className="text-muted-foreground text-md md:text-lg">
          Search for rides by entering your departure and destination locations
        </p>
      </div>
      <Search />
    </div>
  )
}

export default Hero