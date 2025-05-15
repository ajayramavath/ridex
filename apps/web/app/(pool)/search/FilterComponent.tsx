import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@ridex/ui/components/select'
import { Checkbox } from '@ridex/ui/components/checkbox'
import { Popover, PopoverTrigger, PopoverContent } from '@ridex/ui/components/popover';
import React, { useState } from 'react'
import { Label } from '@ridex/ui/components/label'
import { Button } from '@ridex/ui/components/button';
import { ChevronDown } from 'lucide-react';

const FilterComponent = () => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const amenities = [
    { id: 'pets', label: 'Pets Allowed' },
    { id: 'smoking', label: 'Smoking Allowed' }
  ];

  const handleSelect = (value: string) => {
    setSelectedAmenities(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className='flex gap-x-8 w-full items-center'>
      <div className='flex items-center gap-x-2'>
        <div className='font-bold text-sm'>
          Sort By:
        </div>
        <div>
          <Select>
            <SelectTrigger className='w-full !bg-card cursor-pointer' defaultValue="departure">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className='p-2'>
              <SelectItem value="departure" className='p-2'>
                Closest to Departure
              </SelectItem>
              <SelectItem className='p-2' value="destination">Closest to Destination</SelectItem>
              <SelectItem className='p-2' value="price">Price</SelectItem>
              <SelectItem className='p-2' value="time">Earliest Departure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='flex items-center gap-x-2'>
        <div className='text-sm font-bold'>
          Amenities:
        </div>
        <Popover>
          <PopoverTrigger asChild className='bg-card'>
            <Button variant="outline" className="md:w-full text-muted-foreground justify-start">
              Amenities
              <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-2">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2 p-4">
                <Checkbox
                  id={amenity.id}
                  checked={selectedAmenities.includes(amenity.id)}
                  className='rounded-sm'
                  onCheckedChange={(checked) => {
                    handleSelect(amenity.id);
                  }}
                />
                <Label htmlFor={amenity.id}>{amenity.label}</Label>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default FilterComponent