import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ridex/ui/components/tabs'
import { Laptop2, UserPen } from 'lucide-react'
import { ScrollArea } from '@ridex/ui/components/scroll-area'

const layout = ({
  appearance,
  profile
}: {
  children: React.ReactNode,
  appearance: React.ReactNode,
  profile: React.ReactNode
}) => {
  return (
    <ScrollArea className='w-full h-screen'>
      <Tabs defaultValue="profile" className="w-full h-full py-14 px-4 md:px-8 md:py-4">
        <TabsList className='bg-card px-2 py-6'>
          <TabsTrigger
            className='text-xs md:text-sm px-4 py-4 data-[state=active]:!text-accent dark:data-[state=active]:!text-primary cursor-pointer'
            value="profile">
            <UserPen />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className='text-xs md:text-sm px-4 py-4 data-[state=active]:!text-accent dark:data-[state=active]:!text-primary cursor-pointer'
          >
            <Laptop2 />
            Appearance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className='h-full'>
          {profile}
        </TabsContent>
        <TabsContent value="appearance" className='h-full'>
          {appearance}
        </TabsContent>
      </Tabs>
    </ScrollArea>
  )
}

export default layout