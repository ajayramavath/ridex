'use client'
import { useGetUserQuery, useLazyGetUploadUrlQuery, useUpdateProfilePhotoMutation } from '@/redux/user/userApi'
import { Avatar, AvatarFallback, AvatarImage } from '@ridex/ui/components/avatar'
import { Button } from '@ridex/ui/components/button'
import { Input } from '@ridex/ui/components/input'
import { Label } from '@ridex/ui/components/label'
import { ScrollArea } from '@ridex/ui/components/scroll-area'
import { Skeleton } from '@ridex/ui/components/skeleton'
import { PlusCircleIcon, Trash, User2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from '@ridex/ui/components/sonner'
import VehicleCard from './VehicleCard'
import PreferenceCard from './PreferenceCard'
import ProfileInfoCard from './ProfileInfoCard'
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'

const ProfilePage = () => {
  const { data: user, isLoading, isError } = useGetUserQuery();
  const [getUploadUrl, { data: uploadUrlData }] = useLazyGetUploadUrlQuery();
  const [updateProfile, { data: updateProfileData }] = useUpdateProfilePhotoMutation();
  const [profile, setProfile] = useState<string | null>()
  const { isMobile } = useMediaQuery()

  useEffect(() => {
    if (user) {
      console.log(user.profile_photo)
      setProfile(user.profile_photo)
    }
  }, [user])

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const uploadPromise = async () => {
      const { url, key } = await getUploadUrl({
        type: 'profile-photo',
        fileType: file.type
      }).unwrap()

      const s3response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (!s3response.ok) {
        throw new Error('Failed to upload to S3')
      }
      await updateProfile({ url: `https://ridex-s3-bucket.s3.amazonaws.com/${key}` })
    }
    toast.promise(uploadPromise(), {
      loading: 'Uploading...',
      success: 'Uploaded successfully',
      error: 'Failed to upload image'
    })
  }

  const handleDeleteProfilePicture = async () => {
    try {
      setProfile(null)
    } catch (error) {
      toast.error('Failed to remove profile picture')
    }
  }

  if (isLoading) {
    return (
      <div className="h-full space-y-6">
        <div className="flex gap-6">
          {/* Avatar Section - Left 40% */}
          <div className="w-[40%] flex items-center gap-x-2 justify-center space-y-4 ">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex justify-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <Skeleton className="flex-1 h-64" />
        </div>
        <div className="flex gap-6">
          <Skeleton className="w-[40%] h-[500px]" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-[500px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }
  if (isError) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error loading profile data</div>
  }
  if (!user) return <div>User not found</div>

  return (
    <>
      <div className='flex flex-col items-center w-full md:flex-row md:items-start'>
        <div className='flex flex-col gap-y-4 w-full justify-center pt-2 md:pt-8 items-center md:w-[40%]'>
          <Avatar className="h-32 w-32">
            <AvatarImage
              src={profile ? profile : undefined}
              alt="Profile"
              className="object-cover h-full w-full bg-card"
            />
            <AvatarFallback className="text-2xl bg-red-400" delayMs={0}>
              <User2Icon />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-row gap-2 md:mt-8">
            <div className="relative">
              <Button asChild
                variant="outline"
                size={isMobile ? "sm" : "lg"}
                className='text-accent dark:text-primary bg-card shadow-none border-accent/20 dark:border-primary/20 border-1 hover:text-accent hover:bg-accent/20 dark:hover:bg-primary/20'
                icon={<PlusCircleIcon className='w-4 h-4' />}>
                <Label htmlFor="profile-picture" className="cursor-pointer">
                  {profile ? 'Change' : `Upload`}
                </Label>
              </Button>
              <Input
                id="profile-picture"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleProfilePictureChange}
              />
            </div>
            {profile && (
              <Button
                icon={<Trash className='w-4 h-4' />}
                size={isMobile ? "sm" : "lg"}
                variant="outline"
                className='text-red-500 bg-card shadow-none border-1 border-red-100/20 hover:bg-card'
                onClick={handleDeleteProfilePicture}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        <ProfileInfoCard />
      </div>
      <div className='w-full flex flex-col md:flex-row'>
        <div className='md:w-[40%] flex md:pr-4'>
          <PreferenceCard />
        </div>
        <VehicleCard />
      </div>
    </>
  )
}

export default ProfilePage