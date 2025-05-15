import CardWrapper from '@/components/auth/CardWrapper'
import RegisterForm from '@/components/auth/RegisterForm'
import React from 'react'

const page = () => {
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center px-4'>
      <CardWrapper title='Sign Up' description='Create an account to start using RideX'>
        <RegisterForm />
      </CardWrapper>
    </div>
  )
}

export default page