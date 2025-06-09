import React from 'react'
import { Roboto } from 'next/font/google'

const fontRoboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
})

const Logo = () => {
  return (
    <div className={`text-lg md:text-2xl font-bold ${fontRoboto.variable} font-mono`}>
      Ride<span className='text-accent'>X</span>
    </div>
  )
}

export default Logo