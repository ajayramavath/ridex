
import React from 'react'
import { Button } from '@ridex/ui/components/button'
import { CircleUserRound, PlusCircleIcon } from 'lucide-react'
import Link from 'next/link'
import Theme from './components/Theme'
import Logo from '../Logo'
import { getAuthSession } from '@/lib/authSession'
import UserAvatar from './components/Avatar'
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar'

const Header = async () => {
  const session = await getAuthSession()

  return (
    <div className='w-full flex justify-center sticky top-0 z-50 shadow-2xs dark:shadow-gray-900 bg-background'>
      <div className='p-3 flex w-full max-w-5xl items-center justify-between'>
        <Link href={'/'}>
          <Logo />
        </Link>
        <div className='md:flex gap-4 hidden items-center'>
          <Link href={'/create-ride'}>
            <Button variant="outline" icon={<PlusCircleIcon size={40} />}>Post a ride</Button>
          </Link>
          {session && session.user?.name ? (
            <UserAvatar photoUrl={session.user.image || ''} name={session.user.name} />
          ) : (
            <>
              <Link href={'/login'}><Button variant="outline">Login</Button></Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className='bg-accent/20 text-accent dark:bg-primary/20 dark:text-primary shadow-none'
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <Theme />
        </div>
        <div className='flex gap-4 md:hidden'>
          <Avatar>
            <AvatarImage />
            <AvatarFallback><CircleUserRound className='cursor-pointer bg-background' size={30} /></AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

export default Header