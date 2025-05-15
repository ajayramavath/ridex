// components/AuthModal.tsx
'use client'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@ridex/ui/components/dialog'
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'
import { Drawer, DrawerContent, DrawerHeader } from '@ridex/ui/components/drawer'
import AuthHeader from './AuthHeader'

interface AuthModalProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthModal({
  children,
  title = "Authentication Required",
  description = "Please login to continue",
}: AuthModalProps) {
  const router = useRouter()
  const { isMobile } = useMediaQuery()

  const onOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  if (isMobile) {
    return (
      <Drawer open={true} onOpenChange={onOpenChange}>
        <DrawerContent className='h-full px-4'>
          <div className='mx-auto w-full text-center h-full'>
            <DrawerHeader>
              <DialogTitle>
                <AuthHeader title={title} description={description} />
              </DialogTitle>
            </DrawerHeader>
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className='flex flex-col justify-between items-center text-primary-foreground'>
          <DialogTitle className='text-sidebar-foreground'>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal