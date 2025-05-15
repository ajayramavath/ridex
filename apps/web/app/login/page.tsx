import CardWrapper from '@/components/auth/CardWrapper'
import LoginForm from '@/components/auth/LoginForm'
import React from 'react'

const page = () => {
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center px-4'>
      <CardWrapper title='Login' description='Login to your account to start using RideX'>
        <LoginForm />
      </CardWrapper>
    </div>
  )
}

export default page