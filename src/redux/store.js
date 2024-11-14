import { configureStore } from '@reduxjs/toolkit';
import countryReducer from './countrySlice';  // We'll define this next

const store = configureStore({
  reducer: {
    countries: countryReducer,  // Using the reducer we define in countrySlice
  },
});

export default store;
