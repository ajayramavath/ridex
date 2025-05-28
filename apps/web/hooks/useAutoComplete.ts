import { Prediction } from "@/actions/autoComplete";
import { fetchPlaceDetails, PlaceDetails } from "@/actions/getPlaceDetails";
import { AutoCompleteType, clearSuggestions, fetchSuggestions, setSelected, setSuggestions, updatePlaceDetailsCache } from "@/redux/common/autoComplete";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { toast } from "@ridex/ui/components/sonner";
import { useDebounce } from "@ridex/ui/hooks/useDebounce";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAutoComplete(type: AutoCompleteType) {
  const dispatch = useAppDispatch();
  const {
    [type]: { selected, suggestions, loading, error },
    _autocomplete_cache: autoCompleteCache,
    _place_details_cache: placeDetailsCache,
  } = useAppSelector(state => state.autoComplete);

  const currentSlice = type.includes('search') ? 'searchRide' : 'createRide'

  const { departure, destination, departureLoading, destinationLoading } = useAppSelector(state => state[currentSlice])

  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debounceQuery = useDebounce(value, 650);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([])

  const fetchAutoCompleteSuggestions = useCallback((query: string, controller: AbortController) => {
    if (query.length < 3) {
      dispatch(clearSuggestions(type));
      return;
    }

    if (autoCompleteCache[query]) {
      dispatch(setSuggestions({ type, suggestions: autoCompleteCache[query] }));
    } else {
      dispatch(fetchSuggestions({
        type,
        query,
        signal: controller.signal
      }));
    }
  }, [dispatch, type, autoCompleteCache])

  useEffect(() => {
    const controller = new AbortController();
    fetchAutoCompleteSuggestions(debounceQuery, controller);

    return () => controller.abort();
  }, [debounceQuery, fetchAutoCompleteSuggestions]);

  const handleSelect = useCallback(async (suggestion: Prediction) => {
    if (inputRef.current && suggestion.description) {
      inputRef.current.value = suggestion.description;
    }
    dispatch(setSelected({ type, selected: suggestion }));
    setIsOpen(false);

    try {
      const cached = placeDetailsCache[suggestion.place_id];
      let pointData
      if (cached) {
        pointData = cached;
      } else {
        pointData = await fetchPlaceDetails(suggestion.place_id) as PlaceDetails;
        dispatch(updatePlaceDetailsCache({ placeId: suggestion.place_id, details: pointData }));
      }

      const actionType = type.includes('search') ? 'search' : 'create';
      const pointType = type.includes('Departure') ? 'departure' : 'destination';

      dispatch({
        type: `${actionType}Ride/set${capitalize(pointType)}`,
        payload: pointData as PlaceDetails
      });
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch place details');
    }
  }, [type]);

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    if (type.includes('Departure') && inputRef.current && departure && departure.full_address && inputRef.current.value === "") {
      inputRef.current.value = departure.full_address;
    }
    if (type.includes('Destination') && inputRef.current && destination && destination.full_address && inputRef.current.value === "") {
      inputRef.current.value = destination.full_address;
    }
  }, [departure, destination]);

  ////click functions for better ui
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < suggestions.length && suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, suggestions, activeIndex]);

  useEffect(() => {
    if (activeIndex >= 0 && suggestionRefs.current[activeIndex]) {
      suggestionRefs.current[activeIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [activeIndex])

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.addEventListener('keydown', handleKeyDown);
      return () => input.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  return {
    inputRef,
    popoverRef,
    suggestionRefs,
    value,
    setValue,
    isOpen,
    setIsOpen,
    suggestions,
    loading,
    error,
    handleSelect,
    activeIndex,
    departureLoading,
    destinationLoading
  };
}