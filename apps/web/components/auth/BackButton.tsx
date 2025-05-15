import { Button } from '@ridex/ui/components/button'
import Link from 'next/link'
import React from 'react'

const BackButton = ({ label, href }: { label: string, href: string }) => {
  return (
    <Button
      variant="link"
      asChild={true}
      className='font-normal text-accent dark:text-primary w-full'>
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
}

export default BackButton