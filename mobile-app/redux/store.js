import { configureStore } from '@reduxjs/toolkit';
import loadingSlice from './slice/loadingSlice';
import mqttSlice from './slice/mqttSlice';

export const store = configureStore({
    reducer: {
        loading: loadingSlice,
        mqtt: mqttSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});