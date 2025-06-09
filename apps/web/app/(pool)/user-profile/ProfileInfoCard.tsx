import { useGetUserQuery, useUpdateProfileInfoMutation } from '@/redux/user/userApi'
import { Button } from '@ridex/ui/components/button'
import { Card, CardContent, CardHeader } from '@ridex/ui/components/card'
import { Input } from '@ridex/ui/components/input'
import { Label } from '@ridex/ui/components/label'
import { Textarea } from '@ridex/ui/components/textarea'
import React, { useEffect, useState } from 'react'

interface FormData {
  name: string
  bio: string
}

const ProfileInfoCard = () => {
  const { data: user, isLoading, isError } = useGetUserQuery()
  const [updateProfileInfo, { data: updateProfileInfoData }] = useUpdateProfileInfoMutation()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
  })

  const [userInfoChanged, setUserInfoChanged] = useState<Boolean>(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (user) {
      if (user.name !== formData.name ||
        user.bio !== formData.bio) {
        setUserInfoChanged(true)
      } else {
        setUserInfoChanged(false)
      }
    }
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      bio: e.target.value
    }))
  }

  const handleProfileInfoUpdate = async () => {
    try {
      await updateProfileInfo({
        name: formData.name,
        bio: formData.bio
      }).unwrap()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Card className='grow w-full md:w-[60%] pt-2 pb-4 border bg-background dark:bg-card gap-0'>
      <CardHeader className='font-medium mb-2 text-sm flex items-center justify-between'>
        Profile Information
        <Button
          variant="link"
          disabled={!userInfoChanged}
          onClick={handleProfileInfoUpdate}
          className='text-accent dark:text-primary'
        >
          Save</Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-4">
          <div className='flex flex-col gap-y-2 '>
            <Label htmlFor="name">Full Name</Label>
            <Input
              value={formData.name}
              onChange={handleInputChange}
              id="name"
              name="name"
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={handleBioChange}
              id="bio"
              name="bio"
              className='resize-none'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileInfoCard