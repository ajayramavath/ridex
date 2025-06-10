import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ridex/ui/components/tabs'

const layout = ({
  joined,
  posted
}: {
  children: React.ReactNode,
  joined: React.ReactNode,
  posted: React.ReactNode
}) => {
  return (
    <Tabs defaultValue="ridesPosted" className="w-full py-2 px-4 md:px-8 md:py-4">
      <TabsList className='bg-card px-2 py-6'>
        <TabsTrigger
          className='px-4 py-4 data-[state=active]:!text-accent dark:data-[state=active]:!text-primary cursor-pointer'
          value="ridesPosted">
          Rides Posted
        </TabsTrigger>
        <TabsTrigger
          value="ridesJoined"
          className='px-4 py-4 data-[state=active]:!text-accent dark:data-[state=active]:!text-primary cursor-pointer'
        >
          Rides Joined
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ridesPosted" className='h-full'>
        {posted}
      </TabsContent>
      <TabsContent value="ridesJoined">
        {joined}
      </TabsContent>
    </Tabs>
  )
}

export default layout