'use client'
import { useCreateRideMutation } from '@/redux/createRide/createRideApi';
import { Step, stepNumber } from '@/redux/createRide/createRideSlice';
import { useAppSelector } from '@/redux/store/hooks';
import { persistor } from '@/redux/store/store';
import { CreateRideInput } from '@ridex/common';
import { Button } from '@ridex/ui/components/button'
import { toast } from '@ridex/ui/components/sonner';
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery';
import { MoveLeftIcon, MoveRightIcon } from 'lucide-react'
import { redirect, usePathname, useRouter } from 'next/navigation'

const getCurrentStep = (pathname: string, steps: Record<stepNumber, Step>) => {
  return Object.values(steps).find(step => step.href === pathname);
};


export const BackButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { steps } = useAppSelector(state => state.createRide)

  const currentStep = getCurrentStep(pathname, steps)
  if (!currentStep || currentStep.backHref === null) return null

  const handleBack = () => {
    if (currentStep.backHref)
      router.push(currentStep.backHref)
  }

  return (
    <MoveLeftIcon
      onClick={handleBack}
      className='cursor-pointer hover:opacity-80 transition-opacity'
    />
  )
}

const CreateButton = ({
  validate,
  onValidationError
}: {
  validate?: () => boolean;
  onValidationError?: (error: string) => void;
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const { steps, departureTime, availableSeats, price, departure, destination, polyline } = useAppSelector(state => state.createRide)
  const [createRide, { isLoading, isError }] = useCreateRideMutation();
  const { isMobile } = useMediaQuery()

  const currentStep = getCurrentStep(pathname, steps)
  if (!currentStep) return null

  const handleNext = () => {
    if (validate && !validate()) {
      return
    }

    if (currentStep.nextHref) {
      router.push(currentStep.nextHref)
    }
    if (currentStep.href === '/create-ride/confirm-ride') {
      handleCreateRide()
    }
  }

  const handleCreateRide = async () => {
    if (!departure || !destination || !departureTime || !availableSeats || !price || !polyline) return
    const payload: CreateRideInput = {
      from: departure,
      to: destination,
      polyline,
      departureTime: new Date(departureTime),
      availableSeats,
      price
    }
    try {
      const response = await createRide(payload).unwrap()
      persistor.pause();
      persistor.flush().then(() => persistor.purge())
      window.location.href = '/create-ride'
      toast.success('Ride created successfully')
    } catch (error) {
      console.log(error);
      toast.error('Failed to create ride')
    }
  }

  return (
    <Button
      onClick={handleNext}
      icon={currentStep.nextHref ? <MoveRightIcon /> : undefined}
      className="min-w-[180px]"
      isLoading={isLoading}
      size={isMobile ? 'sm' : 'lg'}
    >
      {currentStep.buttonText}
    </Button>
  )
}

export default CreateButton