import React from 'react'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav';
import Logo from '@/components/Logo';
import Theme from '@/components/Header/components/Theme';

const layout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <div className="md:hidden inset-x-0 border-b bg-background/50 
      backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 flex items-center justify-between px-8 py-2 z-50">
        <Logo />
        <Theme />
      </div>

      <div className='flex items-start bg-sidebar md:pt-2 h-screen overflow-hidden'>
        <aside className='hidden md:flex'><Sidebar /></aside>
        <main className='flex-1 bg-background min-w-0 md:max-w-7xl h-full md:rounded-tl-2xl overflow-y-auto'>
          <div className='w-full mx-auto pt-14 pb-16 md:py-0 relative h-full'>
            <div className='absolute overflow-y-auto overflow-x-hidden top-[45px] bottom-16 left-0 right-0 md:static md:top-0 md:bottom-0'>
              {children}
            </div>
          </div>
        </main>
      </div>

      <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50'>
        <MobileNav />
      </nav>
    </>
  )
}

export default layout