import { PlaceDetails } from '@/actions/getPlaceDetails'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type createRide = 'departure' | 'destination'

export type stepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface Step {
  step: stepNumber
  href: string,
  nextHref: string | null,
  backHref: string | null,
  buttonText: string,
}

export const steps: Record<stepNumber, Step> = {
  1: {
    step: 1,
    href: '/create-ride/pick-up',
    nextHref: '/create-ride/drop-off',
    backHref: null,
    buttonText: 'Confirm Pick Up'
  },
  2: {
    step: 2,
    href: '/create-ride/drop-off',
    nextHref: '/create-ride/select-route',
    backHref: '/create-ride/pick-up',
    buttonText: 'Confirm Drop Off'
  },
  3: {
    step: 3,
    href: '/create-ride/select-route',
    nextHref: '/create-ride/date',
    backHref: '/create-ride/drop-off',
    buttonText: 'Confirm Route'
  },
  4: {
    step: 4,
    href: '/create-ride/date',
    nextHref: '/create-ride/passengers',
    backHref: '/create-ride/select-route',
    buttonText: 'Confirm Date'
  },
  5: {
    step: 5,
    href: '/create-ride/passengers',
    nextHref: '/create-ride/price',
    backHref: '/create-ride/date',
    buttonText: 'Confirm Passengers'
  },
  6: {
    step: 6,
    href: '/create-ride/price',
    nextHref: '/create-ride/confirm-ride',
    backHref: '/create-ride/passengers',
    buttonText: 'Confirm Price'
  },
  7: {
    step: 7,
    href: '/create-ride/confirm-ride',
    nextHref: null,
    backHref: '/create-ride/price',
    buttonText: 'Confirm Ride'
  }
}

export interface CreateRideState {
  currentStep: stepNumber,
  steps: Record<stepNumber, Step>,
  departureTime: Date | null,
  availableSeats: number,
  price: number,
  departure: PlaceDetails | null,
  departureLoading: boolean,
  destination: PlaceDetails | null,
  destinationLoading: boolean,
  polyline: string | null,
  ride_distance_m: number | null,
  ride_duration_s: string | null
}

const initialState: CreateRideState = {
  currentStep: 1,
  steps,
  departureTime: null,
  availableSeats: 1,
  price: 0,
  departure: null,
  departureLoading: false,
  destination: null,
  destinationLoading: false,
  polyline: null,
  ride_distance_m: null,
  ride_duration_s: null
}

const createRideSlice = createSlice({
  name: "createRide",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<stepNumber>) => {
      state.currentStep = action.payload
    },
    setDeparture: (state, action) => {
      state.departure = action.payload
    },
    setDestination: (state, action: PayloadAction<PlaceDetails>) => {
      console.log('setting destination', action.payload)
      state.destination = action.payload
    },
    setLocation: (state, action: PayloadAction<{ type: createRide, location: PlaceDetails }>) => {
      if (action.payload.type === 'departure') {
        state.departure = action.payload.location
      } else {
        state.destination = action.payload.location
      }
    },
    setDepartureTime: (state, action: PayloadAction<Date>) => {
      state.departureTime = action.payload
    },
    setAvailableSeats: (state, action: PayloadAction<number>) => {
      state.availableSeats = action.payload
    },
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload
    },
    setLoading: (state, action: PayloadAction<{ type: createRide, loading: boolean }>) => {
      if (action.payload.type === 'departure') {
        state.departureLoading = action.payload.loading
      } else {
        state.destinationLoading = action.payload.loading
      }
    },
    setRoute: (state, action: PayloadAction<{
      polyline: string,
      ride_distance_m: number,
      ride_duration_s: string
    }>) => {
      state.polyline = action.payload.polyline,
        state.ride_distance_m = action.payload.ride_distance_m,
        state.ride_duration_s = action.payload.ride_duration_s
    }
  }
})

export const {
  setStep,
  setDeparture,
  setDestination,
  setLocation,
  setDepartureTime,
  setAvailableSeats,
  setPrice,
  setLoading,
  setRoute
} = createRideSlice.actions;

export default createRideSlice.reducer;