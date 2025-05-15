import { PlaceDetails } from '@/actions/getPlaceDetails'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RideSearchResult } from '@ridex/common'

export interface SearchRideState {
  step: number,
  departurePointId: string | null,
  destinationPointId: string | null,
  departureDate: Date,
  availableSeats: number,
  price: number | null,
  departure: PlaceDetails | null,
  departureLoading: boolean,
  destination: PlaceDetails | null,
  destinationLoading: boolean,
  searchResults: RideSearchResult | null,
}

const initialState: SearchRideState = {
  step: 1,
  departurePointId: null,
  destinationPointId: null,
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
    setDeparturePointId: (state, action: PayloadAction<string>) => {
      state.departurePointId = action.payload
    },
    setDestinationPointId: (state, action: PayloadAction<string>) => {
      state.destinationPointId = action.payload
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
    setSearchResults: (state, action: PayloadAction<RideSearchResult>) => {
      state.searchResults = action.payload
    }
  }
})

export const {
  setStep,
  setDeparture,
  setDestination,
  setDestinationPointId,
  setDeparturePointId,
  setDate,
  setAvailableSeats,
  setPrice,
  setDepartureLoading,
  setDestinationLoading,
  setSearchResults
} = searchRideSlice.actions;

export default searchRideSlice.reducer;