import { Button } from '@ridex/ui/components/button'
import { Card, CardContent, CardHeader } from '@ridex/ui/components/card'
import { Input } from '@ridex/ui/components/input'
import { Label } from '@ridex/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ridex/ui/components/select'
import React, { useEffect, useState } from 'react'
import { GetUserResponse, User, Vehicle } from '@ridex/common'
import { useDeleteVehicleMutation, useGetUserQuery, useLazyGetUploadUrlQuery, useSaveVehicleMutation } from '@/redux/user/userApi'
import { carColoursData, carData } from '@/utils/carData'
import { cn } from '@ridex/ui/lib/utils'
import { PlusIcon, Trash } from 'lucide-react'
import { toast } from '@ridex/ui/components/sonner'
import { z } from 'zod'

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
  photo1: z.string().optional(),
  photo2: z.string().optional()
})

const VehicleCard = () => {
  const { data: user, refetch } = useGetUserQuery();
  const [saveVehicle, { isLoading, isError }] = useSaveVehicleMutation();
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
        await saveVehicle(result.data).unwrap()
        toast.success('Vehicle information saved successfully')
      } catch (error) {
        console.log(error)
      }
    } else {
      toast.error(result.error.issues[0]?.message)
    }
  }

  return (
    <Card className='md:my-4 md:w-[60%] border-none'>
      <CardHeader className='font-medium text-accent dark:text-primary'>Vehicle Information</CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col gap-y-4'>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <Select
                value={vehicle?.brand}
                onValueChange={(value) => handleVehicleInputChange('brand', value)}
              >
                <SelectTrigger
                  className='w-full'
                >
                  <SelectValue placeholder="Select brand" />
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
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select model" />
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
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {carColoursData.map(color => (
                    <SelectItem key={color.hex} value={color.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['photo1', 'photo2'] as const).map((photoField) => (
              <div key={photoField} className="space-y-2">
                <Label>{`Photo ${photoField.slice(-1)}`}</Label>
                <div className="flex items-center gap-4">
                  {vehicle[photoField] ? (
                    <>
                      <img
                        src={vehicle[photoField]}
                        alt={`Vehicle ${photoField}`}
                        className="h-24 w-24 rounded-md object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleVehicleInputChange(photoField, '')}
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <div className="relative">
                      <Button asChild variant="outline">
                        <Label htmlFor={`${vehicle.id}-${photoField}`} className="cursor-pointer">
                          Upload
                        </Label>
                      </Button>
                      <Input
                        id={`${vehicle.id}-${photoField}`}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleVehicleImageUpload(photoField, e)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div> */}
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
