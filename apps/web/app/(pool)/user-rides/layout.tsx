import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ridex/ui/components/tabs'
import { Laptop2, UserPen } from 'lucide-react'
import { ScrollArea } from '@ridex/ui/components/scroll-area'

const layout = ({
  joined,
  posted
}: {
  children: React.ReactNode,
  joined: React.ReactNode,
  posted: React.ReactNode
}) => {
  return (
    <ScrollArea className='w-full h-screen'>
      <Tabs defaultValue="ridesPosted" className="w-full h-full px-4 md:px-8 md:py-4">
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
        <TabsContent value="ridesPosted" className='h-[calc(100%-60px)] md:h-full'>
          <ScrollArea className='h-full w-full'>
            {posted}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="ridesJoined" className='h-[calc(100%-60px)] md:h-full'>
          <ScrollArea className='h-full w-full'>
            {joined}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  )
}

export default layout