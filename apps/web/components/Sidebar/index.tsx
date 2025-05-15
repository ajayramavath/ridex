import React from 'react'
import Logo from '../Logo'
import User from './components/User'
import Theme from '../Header/components/Theme'
import Menu from './components/Menu'
import Logout from '../Logout'
import { getAuthSession } from '@/lib/authSession'

const index = async () => {
  const session = await getAuthSession()
  return (
    <div className='w-[250px] flex flex-col gap-y-4 min-h-screen min-w-[250px] max-w-[250px] px-2 pb-4'>
      <div className='flex items-center justify-between'>
        <Logo />
        <Theme />
      </div>
      <User />
      <div className='grow'>
        <Menu />
      </div>
      {session && session.user?.name ? <Logout /> : null}
    </div>
  )
}

export default index