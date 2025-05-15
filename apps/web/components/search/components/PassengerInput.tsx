'use client'
import React from "react";
import { Input } from "@ridex/ui/components/input";
import { MinusIcon, PlusIcon, User } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from '@ridex/ui/components/popover'
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { setAvailableSeats } from "@/redux/searchRide/searchRideSlice";
import { useMediaQuery } from "@ridex/ui/hooks/useMediaQuery";
import { cn } from "@ridex/ui/lib/utils";

const PassengerInput = () => {
  const dispatch = useAppDispatch();
  const { availableSeats } = useAppSelector((state) => state.searchRide);
  const { isMobile } = useMediaQuery()

  return (
    <div className="md:p-1">
      <Popover>
        <PopoverTrigger asChild>
          <div>
            <Input
              icon={<User size={isMobile ? 15 : 20} />}
              inputSize={isMobile ? 'md' : 'lg'}
              placeholder='Passengers'
              className={cn('!rounded-md hover:bg-gray-100 !bg-sidebar text-ellipsis w-full text-left',
                isMobile ? '!text-xs' : 'text-base'
              )}
              value={availableSeats > 1 ? availableSeats + ' passengers' : '1 passenger'}
              readOnly
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-40" align="start">
          <div className="max-w-sm flex justify-around items-center">
            <MinusIcon
              style={availableSeats === 1 ? { opacity: 0.5, cursor: 'default' } : {}}
              size={20}
              className="cursor-pointer"
              onClick={() => dispatch(setAvailableSeats(Math.max(availableSeats - 1, 1)))} />
            <div className="text-primary">{availableSeats}</div>
            <PlusIcon
              style={availableSeats === 5 ? { opacity: 0.5, cursor: 'default' } : {}}
              size={20}
              className="cursor-pointer"
              onClick={() => dispatch(setAvailableSeats(Math.min(availableSeats + 1, 5)))} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PassengerInput;
