import { Button } from '@ridex/ui/components/button'
import { Card, CardContent, CardHeader } from '@ridex/ui/components/card'
import { Input } from '@ridex/ui/components/input'
import { Label } from '@ridex/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ridex/ui/components/select'
import React, { useEffect, useState } from 'react'
import { GetUserResponse, User, Vehicle } from '@ridex/common'
import { useAddVehicleMutation, useDeleteVehicleMutation, useGetUserQuery, useLazyGetUploadUrlQuery, useUpdateVehicleMutation } from '@/redux/user/userApi'
import { carColoursData, carData } from '@/utils/carData'
import { cn } from '@ridex/ui/lib/utils'
import { PlusIcon, Trash } from 'lucide-react'
import { toast } from '@ridex/ui/components/sonner'

const VehicleCard = () => {
  const { data: user, refetch } = useGetUserQuery();
  const [getUploadUrl, { data: uploadUrlData }] = useLazyGetUploadUrlQuery();
  const [updateVehicle, { data: updateVehicleData }] = useUpdateVehicleMutation();
  const [addVehicle, { data: addVehicleData }] = useAddVehicleMutation();
  const [deleteVehicle, { data: deleteVehicleData }] = useDeleteVehicleMutation();
  const [vehicles, setVehicles] = useState<Partial<Vehicle>[]>([])
  const [errors, setErrors] = useState<Record<number, string | null>>({});

  useEffect(() => {
    if (user?.vehicles)
      setVehicles(user.vehicles)
  }, [user?.vehicles])

  const validateVehicle = (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): string | null => {
    if (!vehicle.name.trim()) return 'Vehicle name is required';
    if (!vehicle.brand.trim()) return 'Vehicle brand is required';
    if (!vehicle.color.trim()) return 'Vehicle color is required';
    return null;
  };

  const handleValidation = (index: number) => {
    const vehicle = vehicles[index];
    if (!vehicle) return true;
    const error = validateVehicle({
      name: vehicle.name || '',
      brand: vehicle.brand || '',
      color: vehicle.color || '',
      photo1: vehicle.photo1 || '',
      photo2: vehicle.photo2 || ''
    });
    setErrors(prev => ({ ...prev, [index]: error }));
    return !error;
  }

  const validateAllVehicles = () => {
    let isValid = true;
    const newErrors: Record<number, string | null> = {};

    vehicles.forEach((_, index) => {
      const vehicleValid = handleValidation(index);
      if (!vehicleValid) isValid = false;
    });

    return isValid;
  };

  const handleAddVehicle = () => {
    if (vehicles.length >= 2) return;
    setVehicles(prev => [
      ...prev,
      {
        name: '',
        brand: '',
        color: '',
        photo1: '',
        photo2: ''
      }
    ]);
  };

  const handleRemoveVehicle = (index: number) => {
    setVehicles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVehicleInputChange = (index: number, field: keyof Vehicle, value: string) => {
    setVehicles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value } as Vehicle;
      return updated;
    });

    if (errors[index]) {
      handleValidation(index);
    }
  };

  const handleVehicleImageUpload = (vehicleIndex: number, photoField: 'photo1' | 'photo2', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleVehicleInputChange(
            vehicleIndex,
            photoField,
            event.target.result as string
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = async () => {
    if (!validateAllVehicles()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      const originalVehicles = user?.vehicles || [];
      const deletedVehicles = originalVehicles.filter(
        original => !vehicles.some(v => v.id === original.id)
      );
      await Promise.all(
        deletedVehicles.map(vehicle =>
          deleteVehicle(vehicle.id).unwrap()
        )
      );
      await Promise.all(
        vehicles.map(vehicle => {
          const vehicleData = {
            name: vehicle.name,
            brand: vehicle.brand,
            color: vehicle.color,
            photo1: vehicle.photo1,
            photo2: vehicle.photo2
          };
          if (!vehicle.id) {
            return addVehicle(vehicleData).unwrap();
          } else {
            return updateVehicle({
              id: vehicle.id,
              data: vehicleData as Vehicle
            }).unwrap();
          }
        })
      );
      toast.success('All vehicle changes saved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to save vehicle changes');
      if (user?.vehicles) setVehicles(user.vehicles);
    }
  };

  return (
    <Card className='md:my-4 md:w-[60%] border-none'>
      <CardHeader className='font-medium text-accent dark:text-primary'>Vehicle Information</CardHeader>
      <CardContent className='space-y-4'>
        {vehicles?.map((vehicle, index) => (
          <div key={vehicle.id || index} className='flex flex-col gap-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select
                  value={vehicle.brand}
                  onValueChange={(value) => handleVehicleInputChange(index, 'brand', value)}
                >
                  <SelectTrigger className='w-full'>
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
                  value={vehicle.name}
                  onValueChange={(value) => handleVehicleInputChange(index, 'name', value)}
                  disabled={!vehicle.brand}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {carData[vehicle.brand as keyof typeof carData]?.map(model => (
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
                  value={vehicle.color}
                  onValueChange={(value) => handleVehicleInputChange(index, 'color', value)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          onClick={() => handleVehicleInputChange(index, photoField, '')}
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
                          onChange={(e) => handleVehicleImageUpload(index, photoField, e)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div>
              {vehicles.length > 1 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleRemoveVehicle(index)}
                  className='text-red-500'
                  icon={<Trash className='w-4 h-4' />}
                >
                  Remove Vehicle
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button
          onClick={handleAddVehicle}
          variant="outline"
          className={cn(vehicles.length >= 1 ? 'hidden' : 'block', '')}
          disabled={vehicles.length >= 1}
          icon={<PlusIcon className='w-4 h-4' />}
        >
          Add Vehicle
        </Button>
        <div className="pt-4">
          <Button
            onClick={handleSaveAll}
            variant="outline"
            className="w-full shadow-none hover:bg-accent/20 hover:text-accent bg-accent/20 dark:bg-primary/20 dark:text-primary text-accent">
            Save Vehicle Information
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default VehicleCard
