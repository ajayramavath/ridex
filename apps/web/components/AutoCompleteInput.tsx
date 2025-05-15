'use client'
import { Input } from '@ridex/ui/components/input'
import { Popover, PopoverContent, PopoverTrigger } from '@ridex/ui/components/popover'
import { ChevronRight, Loader2, MousePointer2 } from 'lucide-react';
import { useAutoComplete } from '@/hooks/useAutoComplete';
import { toast } from '@ridex/ui/components/sonner';
import { AutoCompleteType } from '@/redux/common/autoComplete';
import { cn } from '@ridex/ui/lib/utils';
import { useMediaQuery } from '@ridex/ui/hooks/useMediaQuery'

export interface AutoCompleteInputProps {
  type: AutoCompleteType;
  placeholder: string;
}

const AutoCompleteInput = ({ type, placeholder }: AutoCompleteInputProps) => {
  const {
    inputRef,
    popoverRef,
    setValue,
    suggestions,
    loading,
    error,
    isOpen,
    setIsOpen,
    handleSelect,
    activeIndex,
    suggestionRefs,
    departureLoading,
    destinationLoading
  } = useAutoComplete(type)
  const { isMobile } = useMediaQuery()

  return (
    <div className='md:p-1'>
      <Popover open={isOpen}>
        <PopoverTrigger asChild={true}>
          <div>
            <Input
              ref={inputRef}
              icon={loading || departureLoading || destinationLoading ?
                <Loader2 size={isMobile ? 15 : 20} className='animate-spin' /> :
                <MousePointer2 size={isMobile ? 15 : 20} />}
              inputSize={isMobile ? 'md' : 'lg'}
              placeholder={placeholder}
              className={cn('!rounded-md hover:bg-gray-100 !bg-sidebar text-ellipsis w-full',
                isMobile ? '!text-xs' : 'text-base'
              )}
              onChange={(e) => {
                setValue(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={7}
          align="start"
          ref={popoverRef}
          className='md:w-full py-4 px-2'
          style={{ display: suggestions.length > 0 ? 'block' : 'none' }}>
          <div className='relative'>
            <div className='max-w-sm min-w-3xs max-h-60 overflow-auto'>
              <div className='flex flex-col gap-2 w-full h-full'>
                {suggestions.map((suggestion, index) => {
                  return (
                    <div
                      role="option"
                      aria-selected={activeIndex === index}
                      tabIndex={0}
                      ref={(el) => {
                        suggestionRefs.current[index] = el
                      }}
                      key={`${suggestion.place_id}-${index}`}
                      onClick={() => { handleSelect(suggestion) }}
                      className={cn(activeIndex === index ? 'bg-accent/10 text-accent dark:bg-primary/10 dark:text-primary' : ""
                        , 'hover:bg-accent/10 hover:text-accent dark:hover:bg-primary/10 dark:hover:text-primary py-2 px-6 overflow-hidden rounded-md cursor-pointer flex justify-between items-center')}>
                      <div className='flex flex-col max-w-3/4'>
                        <div className='font-semibold text-sm text-gray-700 dark:text-gray-100'>
                          {suggestion.description.split(',')[0]}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {suggestion.description.split(',').slice(1).join(', ')}
                        </div>
                      </div>
                      <span className='text-accent'><ChevronRight size={20} /></span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>

  )
}

export default AutoCompleteInput