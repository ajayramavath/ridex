'use client'
import { useAppSelector } from '@/redux/store/hooks'
import { redirect } from 'next/navigation'

const CreateRide = () => {
  const { steps, currentStep } = useAppSelector(state => state.createRide)
  redirect(steps[currentStep].href)

}

export default CreateRide