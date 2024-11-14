import { createSlice } from '@reduxjs/toolkit';

// Initial state for countries
const initialState = {
  countries: [], // This will hold the list of countries
};

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    setCountriesStore: (state, action) => {
      state.countries = action.payload; // Set the list of countries
    },
    updateCountry: (state, action) => {
      // Find the country and update it
      const index = state.countries.findIndex(
        (country) => country.cca3 === action.payload.cca3
      );
      if (index !== -1) {
        state.countries[index] = action.payload;
      }
    },
    deleteCountryStore: (state, action) => {
      state.countries = state.countries.filter(
        (country) => country.cca3 !== action.payload
      );
    },
  },
});

// Export the actions to be used in components
export const { setCountriesStore, updateCountry, deleteCountryStore } = countrySlice.actions;

// Export the reducer to be added to the store
export default countrySlice.reducer;
