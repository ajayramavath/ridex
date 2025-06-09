import { configureStore } from '@reduxjs/toolkit';
import searchRideReducer, { SearchRideState } from '../searchRide/searchRideSlice';
import autoCompleteReducer from '../common/autoComplete';
import addressReducer from '../address/addressSlice';
import createRideReducer, { CreateRideState } from '../createRide/createRideSlice';
import { createTransform, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/lib/persistStore';
import { baseApi } from './baseApi'

const createRideTransform = createTransform(
  (inboundState: CreateRideState) => {
    return {
      ...inboundState,
      departureTime: inboundState.departureTime?.toISOString() || null,
    };
  },
  (outboundState: any) => {
    return {
      ...outboundState,
      departureTime: outboundState.departureTime ? new Date(outboundState.departureTime) : null,
    };
  },
  { whitelist: ['createRide'] }
);

const searchRideTransform = createTransform(
  (inboundState: SearchRideState) => {
    return {
      ...inboundState,
      departureDate: inboundState.departureDate?.toISOString() || null,
    };
  },
  (outboundState: any) => {
    return {
      ...outboundState,
      departureDate: outboundState.departureDate ? new Date(outboundState.departureDate) : null,
    };
  },
  { whitelist: ['createRide'] }
);

const createRidePersistConfig = {
  key: 'createRide',
  storage,
  transforms: [createRideTransform],
  blacklist: ['departureLoading', 'destinationLoading'],
};

const searchRidePersistConfig = {
  key: 'searchRide',
  storage,
  transforms: [searchRideTransform],
  blacklist: ['departureLoading', 'destinationLoading']
};

const persistedCreateRideReducer = persistReducer(createRidePersistConfig, createRideReducer);
const persistedSearchRideReducer = persistReducer(searchRidePersistConfig, searchRideReducer);

const rootReducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  searchRide: persistedSearchRideReducer,
  autoComplete: autoCompleteReducer,
  createRide: persistedCreateRideReducer,
  address: addressReducer
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;