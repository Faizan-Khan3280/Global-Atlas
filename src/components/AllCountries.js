import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CountryList.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCountryStore, setCountriesStore } from '../redux/countrySlice';

const CountryList = () => {
  const [countries, setCountries] = useState([]); // Countries with sorting applied
  const [originalCountries, setOriginalCountries] = useState([]); // Original country list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('name'); // Default sort by name
  const [ascending, setAscending] = useState(true); // Ascending order
  const dispatch = useDispatch();
  const countriess = useSelector((state)=> state.countries);

  // Fetch data on component mount
  useEffect(() => {
    if (countriess.countries.length <= 0) {
      setLoading(true);
      axios.get('https://restcountries.com/v3.1/all')
        .then((response) => {
          dispatch(setCountriesStore(response.data));
          setOriginalCountries(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError('Something went wrong while fetching countries.');
          setLoading(false);
        });
    } else {
      setCountries(countriess.countries);
      setLoading(false);  // Set loading to false if data already exists
    }
  }, [countriess.countries, dispatch]);

  // Sort the countries based on the selected sort order (name or population)
  const sortCountries = () => {
    const sortedCountries = [...countries];
    if (sortOrder === 'name') {
      sortedCountries.sort((a, b) => {
        const nameA = a.name.common.toLowerCase();
        const nameB = b.name.common.toLowerCase();
        if (nameA < nameB) return ascending ? -1 : 1;
        if (nameA > nameB) return ascending ? 1 : -1;
        return 0;
      });
    } else if (sortOrder === 'population') {
      sortedCountries.sort((a, b) => {
        if (a.population < b.population) return ascending ? -1 : 1;
        if (a.population > b.population) return ascending ? 1 : -1;
        return 0;
      });
    }
    return sortedCountries;
  };

  // Handle sorting changes
  const handleSortChange = (sortBy) => {
    if (sortBy === sortOrder) {
      setAscending(!ascending); // Toggle the order if the same sorting criterion is selected
    } else {
      setSortOrder(sortBy);
      setAscending(true); // Default to ascending order
    }
  };

  // Handle country deletion
  const handleDelete = (countryCode) => {
    dispatch(deleteCountryStore(countryCode));
  };

  // Handle Reset Button Click
  const handleReset = () => {
    setCountries(originalCountries); // Reset the list to its original state
    setSortOrder('name'); // Reset the sorting to 'name'
    setAscending(true); // Reset the sort order to ascending
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const sortedCountries = sortCountries();

  return (
    <div className='AllCountries'>
      <h1>List of Countries</h1>

      <div className="sort-controls">
        <button onClick={() => handleSortChange('name')}>
          Sort by Name {sortOrder === 'name' ? (ascending ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => handleSortChange('population')}>
          Sort by Population {sortOrder === 'population' ? (ascending ? '↑' : '↓') : ''}
        </button>
        {/* Reset Button */}
        <button onClick={handleReset} className="reset-button">
          Reset
        </button>
      </div>

      <ul>
        {sortedCountries.map((country) => (
          <li key={country.cca3}>
            <div className="country-item-container">
              <Link to={`/country/${country.cca3}`} className="country-item">
                <img src={country.flags.png} alt={country.name.common} width="80" />
                <h2>{country.name.common}</h2>
                <p>Population: {country.population.toLocaleString()}</p>
              </Link>
              <button 
                onClick={() => handleDelete(country.cca3)} 
                className="delete-button">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
