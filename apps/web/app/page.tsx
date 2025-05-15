import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { getAuthSession } from "@/lib/authSession";
import { redirect } from "next/navigation";

export default async function Page() {
  // const session = await getAuthSession()
  // if (session && session.user?.name)
  redirect('/search')

  return (
    <div className="min-h-screen h-screen flex flex-col items-center gap-y-6">
      <header className="w-full">
        <Header />
      </header>
      <Hero />
    </div>
  )
}
