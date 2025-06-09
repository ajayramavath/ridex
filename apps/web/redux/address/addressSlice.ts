// store/addressSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaceDetails } from '@/actions/getPlaceDetails';

type LatLngKey = string;

export interface AddressState {
  data: Record<LatLngKey, PlaceDetails>;
  isLoading: boolean;
}

const initialState: AddressState = {
  data: {},
  isLoading: false,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress(state, action: PayloadAction<{ lat: number; lng: number; details: PlaceDetails }>) {
      const key = `${action.payload.lat},${action.payload.lng}`;
      state.data[key] = action.payload.details;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  },
});

export const {
  setAddress,
  setLoading
} = addressSlice.actions;
export default addressSlice.reducer;
