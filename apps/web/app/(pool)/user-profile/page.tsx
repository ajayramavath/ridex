import { getAuthSession } from '@/lib/authSession'
import { redirect } from 'next/navigation'

const page = async () => {
  const session = await getAuthSession()
  if (!session || !session.user || !session.user.name) redirect('/login')
  redirect('/user-profile/profile')
}

export default page