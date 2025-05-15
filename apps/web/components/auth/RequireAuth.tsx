'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const modal = searchParams.get('modal')
  const { data: session } = useSession()

  useEffect(() => {
    const token = session?.accessToken
    if (!token && modal !== 'true') {
      router.push(`${window.location.pathname}?modal=true`)
    }
  }, [router, modal])

  return <>{children}</>
}