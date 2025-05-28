import { PlaceDetails } from '@/actions/getPlaceDetails'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RideSearch, RideSearchResult } from '@ridex/common'

export interface SearchRideState {
  step: number,
  departureDate: Date,
  availableSeats: number,
  price: number | null,
  departure: PlaceDetails | null,
  departureLoading: boolean,
  destination: PlaceDetails | null,
  destinationLoading: boolean,
  searchResults: RideSearch[] | null,
}

const initialState: SearchRideState = {
  step: 1,
  departureDate: new Date(),
  availableSeats: 1,
  price: null,
  departure: null,
  departureLoading: false,
  destination: null,
  destinationLoading: false,
  searchResults: null,
}

const searchRideSlice = createSlice({
  name: "searchRide",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
    setDeparture: (state, action) => {
      state.departure = action.payload
    },
    setDestination: (state, action: PayloadAction<PlaceDetails>) => {
      state.destination = action.payload
    },
    setDate: (state, action: PayloadAction<Date>) => {
      state.departureDate = action.payload
    },
    setAvailableSeats: (state, action: PayloadAction<number>) => {
      state.availableSeats = action.payload
    },
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload
    },
    setDepartureLoading: (state, action: PayloadAction<boolean>) => {
      state.departureLoading = action.payload
    },
    setDestinationLoading: (state, action: PayloadAction<boolean>) => {
      state.destinationLoading = action.payload
    },
    setSearchResults: (state, action: PayloadAction<{ "message": string, "data": RideSearch[] }>) => {
      state.searchResults = action.payload.data
    }
  }
})

export const {
  setStep,
  setDeparture,
  setDestination,
  setDate,
  setAvailableSeats,
  setPrice,
  setDepartureLoading,
  setDestinationLoading,
  setSearchResults
} = searchRideSlice.actions;

export default searchRideSlice.reducer;