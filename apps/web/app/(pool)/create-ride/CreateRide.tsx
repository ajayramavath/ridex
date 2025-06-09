'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/store/hooks'
import { useGetUserQuery } from '@/redux/user/userApi'
import { toast } from '@ridex/ui/components/sonner'
import { LoaderIcon } from 'lucide-react'

export default function CreateRide() {
  const router = useRouter()
  const { data: user, isLoading, isFetching } = useGetUserQuery()
  const { steps, currentStep } = useAppSelector(s => s.createRide)

  const didRedirect = useRef(false)

  if (isLoading || isFetching) {
    return (
      <div className='flex items-center justify-center h-full'>
        <LoaderIcon className='animate-spin' />
      </div>
    )
  }

  useEffect(() => {
    if (didRedirect.current) return

    if (!user || !user.vehicle) {
      toast.error('Please add your vehicle to create a ride!')
      router.replace('/user-profile')
      didRedirect.current = true
      return
    }

    router.replace(steps[currentStep].href)
    didRedirect.current = true
  }, [
    user,
    user?.vehicle,
    steps,
    currentStep,
    router,
    isLoading,
    isFetching
  ])

  return null
}
