'use client'
import React, { useState } from 'react'
import { SigninSchema } from '@ridex/common'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ridex/ui/components/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@ridex/ui/components/input'
import { Button } from '@ridex/ui/components/button'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@ridex/ui/components/sonner'
import BackButton from './BackButton'

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log("Final API URL:", `${process.env.NEXT_PUBLIC_API_URL}/login`);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (result?.error) {
      console.log(result)
      toast.error(result.error)
    } else {
      toast.success("Login Successful");
      const redirectPath = callbackUrl.startsWith('http')
        ? new URL(callbackUrl).pathname
        : callbackUrl;
      console.log("Redirecting to:", redirectPath);
      window.location.href = redirectPath;
    }
    setIsLoading(false);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground'>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder='john@example.com' className='bg-white' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground'>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder='************' className='bg-white' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            variant="outline"
            type='submit'
            className='w-full shadow-none border-none bg-accent/20 text-accent dark:bg-primary/20 dark:text-primary'
            isLoading={isLoading}>
            Log In
          </Button>
        </form>
      </Form>
      <div>
        <BackButton label='New here? Sign Up' href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} />
      </div>
    </>
  )
}

export default LoginForm