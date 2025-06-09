import { Button } from '@ridex/ui/components/button'
import { Card, CardContent, CardHeader } from '@ridex/ui/components/card'
import { Input } from '@ridex/ui/components/input'
import { Label } from '@ridex/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ridex/ui/components/select'
import React, { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react'
import { GetUserResponse, User, Vehicle } from '@ridex/common'
import { useDeleteVehicleMutation, useGetUploadUrlQuery, useGetUserQuery, useLazyGetUploadUrlQuery, useRemoveVehiclePhotoMutation, useSaveVehicleMutation } from '@/redux/user/userApi'
import { carColoursData, carData } from '@/utils/carData'
import { cn } from '@ridex/ui/lib/utils'
import { Plus, PlusIcon, Trash, X } from 'lucide-react'
import { toast } from '@ridex/ui/components/sonner'
import { z } from 'zod'
import Image from 'next/image'

interface VehicleState {
  brand: string | undefined;
  color: string | undefined;
  name: string | undefined;
  photo1: string | undefined | null;
  photo2: string | undefined | null;
}

const vehicleData = z.object({
  brand: z.string({ message: "Please select a brand" }).min(1),
  name: z.string({ message: "Please select the model of the car" }).min(1),
  color: z.string({ message: "Please select a color" }).min(1),
  photo1: z.string().nullable().optional(),
  photo2: z.string().nullable().optional()
})

const VehicleCard = () => {
  const { data: user, refetch } = useGetUserQuery();
  const [saveVehicle, { isLoading, isError }] = useSaveVehicleMutation();
  const [getUploadUrl, { data: uploadUrlData }] = useLazyGetUploadUrlQuery();
  const [removeVehiclePhoto, { isLoading: isRemovingVehiclePhoto }] = useRemoveVehiclePhotoMutation();
  const [photos, setPhotos] = useState<(string | null)[]>([
    user?.vehicle?.photo1 ?? null,
    user?.vehicle?.photo2 ?? null
  ]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [disabled, setDisabled] = useState(false)
  const [vehicle, setVehicle] = useState<VehicleState>({
    brand: user?.vehicle?.brand,
    color: user?.vehicle?.color,
    name: user?.vehicle?.name,
    photo1: user?.vehicle?.photo1,
    photo2: user?.vehicle?.photo2
  });

  const handleVehicleInputChange = (field: keyof Pick<Vehicle, 'brand' | 'color' | 'name'>, value: string) => {
    setVehicle((vehicle) => ({ ...vehicle, [field]: value }))
  }

  const handleSave = async () => {
    const result = vehicleData.safeParse(vehicle)
    if (result.success) {
      try {
        await saveVehicle({
          name: result.data.name,
          brand: result.data.brand,
          color: result.data.color,
          photo1: result.data.photo1 ?? undefined,
          photo2: result.data.photo2 ?? undefined
        }).unwrap()
        toast.success('Vehicle information saved successfully')
      } catch (error) {
        console.log(error)
      }
    } else {
      toast.error(result.error.issues[0]?.message)
    }
  }

  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Please upload JPG, PNG, or WebP images only.');
      return false;
    }
    if (file.size > maxFileSize) {
      toast.error('File size must be less than 5MB.');
      return false;
    }
    return true;
  };

  const handleFileSelect = (index: number, file: File) => {
    if (!file || !(validateFile(file))) return;
    const uploadPromise = async () => {
      const { url, key } = await getUploadUrl({
        type: 'vehicle-photo',
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
      const newPhotos = [...photos];
      newPhotos[index] = `https://ridex-s3-bucket.s3.amazonaws.com/${key}`
      setVehicle(prev => ({ ...prev, photo1: newPhotos[0], photo2: newPhotos[1] }))
      setPhotos(newPhotos);
    }
    toast.promise(uploadPromise(), {
      loading: 'Uploading...',
      success: 'Uploaded successfully',
      error: 'Failed to upload image'
    })
  };


  const handleFileInputChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(index, file);
    }
    e.target.value = '';
  };

  const removePhoto = async (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setVehicle(prev => ({ ...prev, photo1: newPhotos[0], photo2: newPhotos[1] }))
    setPhotos(newPhotos);
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const getUploadedCount = () => {
    return photos.filter(photo => photo !== null).length;
  };

  return (
    <Card className='md:my-4 gap-2 py-4 md:w-[60%] border bg-background dark:bg-card'>
      <CardContent className='flex flex-col'>
        <div className='flex md:flex-row flex-col gap-y-2 gap-x-4 h-full'>
          <div className='flex flex-col gap-y-2 w-full'>
            <h4 className="text-sm font-medium mb-2">Vehicle Information</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select
                  value={vehicle?.brand}
                  onValueChange={(value) => handleVehicleInputChange('brand', value)}
                >
                  <SelectTrigger className='w-full shadow-none' size='sm'>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(carData).map(brand => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Select
                  value={vehicle?.name}
                  onValueChange={(value) => handleVehicleInputChange('name', value)}
                  disabled={!vehicle?.brand}
                >
                  <SelectTrigger className='w-full shadow-none' size='sm'>
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {carData[vehicle?.brand as keyof typeof carData]?.map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Select
                  value={vehicle?.color}
                  onValueChange={(value) => handleVehicleInputChange('color', value)}
                >
                  <SelectTrigger className='w-full shadow-none' size='sm'>
                    <SelectValue placeholder="Select Color" />
                  </SelectTrigger>
                  <SelectContent>
                    {carColoursData.map(color => (
                      <SelectItem key={color.hex} value={color.name}>
                        <div className="flex items-center gap-2">
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="w-full grow">
            <div className="p-3 border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Photos</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add up to 2 photos
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{getUploadedCount()}</div>
                  <div className="text-xs text-gray-500">of 2</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo, index: number) => (
                <div key={index} className="relative group">
                  <input
                    ref={(el: HTMLInputElement | null) => {
                      fileInputRefs.current[index] = el;
                    }}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange(index)}
                    className="hidden"
                  />
                  {photo && photo != "" ? (
                    <div className="relative aspect-square rounded-lg bg-gray-100 border border-gray-200">
                      <div className='overflow-hidden'>
                        <Image
                          src={photo}
                          alt={`Vehicle photo ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          priority={index === 0}
                        />
                      </div>
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute cursor-pointer z-2 top-[-8px] right-[-8px] p-0.5 bg-gray-200 rounded-full transition-all duration-200 hover:scale-110"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => triggerFileInput(index)}
                      className="aspect-square rounded-lg border-2 border-dashed
                       hover:border-blue-400 dark:hover:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/50 
                       transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex flex-col items-center justify-center h-full space-y-1">
                        <div className="p-1.5 bg-gray-200 rounded-full group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-200">
                          <Plus className="h-3 w-3 text-gray-500 group-hover:text-blue-600" />
                        </div>
                        <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                          Add
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-4">
          <Button
            onClick={handleSave}
            variant="outline"
            isLoading={isLoading}
            className="w-full shadow-none hover:bg-accent/20 hover:text-accent bg-accent/20 dark:bg-primary/20 dark:text-primary text-accent">
            Save Vehicle Information
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default VehicleCard
