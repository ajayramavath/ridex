import { configureStore } from '@reduxjs/toolkit';
import searchRideReducer from '../searchRide/searchRideSlice';
import autoCompleteReducer from '../common/autoComplete';
import createRideReducer, { CreateRideState } from '../createRide/createRideSlice';
import { createTransform, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/lib/persistStore';
import { baseApi } from './baseApi'

const rideTransform = createTransform(
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

const persistConfig = {
  key: 'createRide',
  storage,
  transforms: [rideTransform],
  blacklist: ['departureLoading', 'destinationLoading']
};

const persistedReducer = persistReducer(persistConfig, createRideReducer);

const rootReducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  searchRide: searchRideReducer,
  autoComplete: autoCompleteReducer,
  createRide: persistedReducer,
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