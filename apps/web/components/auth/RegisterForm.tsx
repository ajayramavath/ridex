'use client'
import React, { useState } from 'react'
import { CreateUserSchemaClient } from '@ridex/common'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@ridex/ui/components/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@ridex/ui/components/input'
import { Button } from '@ridex/ui/components/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from '@ridex/ui/components/sonner'
import BackButton from './BackButton'

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/pool";
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateUserSchemaClient),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: ""
    }
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    if (res.ok) {
      toast.success("User Created Successfully!")
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (result?.error) {
        toast.error("Login Failed! Please try again")
        router.push('/login')
      } else {
        const redirectPath = callbackUrl.startsWith('http')
          ? new URL(callbackUrl).pathname
          : callbackUrl;
        window.location.href = redirectPath;
      }
      setIsLoading(false);
    } else {
      const response = await res.json()
      toast.error(`User Creation Failed! Please try again ${response.message}`)
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground'>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder='john' className='bg-white' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                  <FormLabel className='text-muted-foreground'>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder='************' className='bg-white' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground'>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder='************' className='bg-white' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' className='w-full' isLoading={isLoading}>
            Sign Up
          </Button>
        </form>
      </Form>
      <div>
        <BackButton label='Already have an account? Login' href={`/login`} />
      </div>
    </>
  )
}

export default RegisterForm