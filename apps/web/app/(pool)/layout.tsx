import React from 'react'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav';
import Logo from '@/components/Logo';

const layout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className='flex items-start bg-sidebar pt-2'>
      <aside className='hidden md:flex'>
        <Sidebar />
      </aside>
      <div className='md:hidden p-4 z-100 right-0 bg-background fixed top-0 left-0'>
        <Logo />
      </div>
      <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50'>
        <MobileNav />
      </nav>
      <main className='w-full bg-background h-screen overflow-hidden py-16 md:py-0 rounded-tl-2xl'>
        <div className='w-full md:max-w-7xl h-full mx-auto'>
          {children}
        </div>
      </main>
    </div>
  )
}

export default layout