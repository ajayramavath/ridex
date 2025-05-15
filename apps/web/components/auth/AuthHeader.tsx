import React from 'react'

const AuthHeader = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className='w-full flex flex-col gap-y-2 items-center justify-center'>
      <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold'>{title}</h1>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}

export default AuthHeader