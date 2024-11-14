import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CountryDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateCountry } from '../redux/countrySlice';

const CountryDetails = () => {
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [borderingCountries, setBorderingCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const countries = useSelector((state) => state.countries);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(countries.countries.length === 0){
      navigate('/');
    } else {
      const countryData = countries.countries.find((c) => c.cca3 === countryCode);
      if (countryData) {
        console.log(countryData)
        setCountry(countryData);
        setLoading(false);
      }
    }
  }, [countryCode, countries.countries]);

  useEffect(() => {
    if (country && country.borders) {
      const borderCountries = country.borders.map((border) => countries.countries.find((c) => c.cca3 === border)).filter(Boolean);
      setBorderingCountries(borderCountries);
    }
  }, [country, countries.countries]);

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'capital') {
      setCountry({
        ...country,
        [name]: [value], 
      });
    } else {
      setCountry({
        ...country,
        [name]: value,
      });
    }
  };
  

  const handleFlagChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFlag = reader.result;
        setCountry({
          ...country,
          flags: {
            ...country.flags,
            png: newFlag,
          },
        });

        dispatch(updateCountry({
          ...country,
          flags: {
            ...country.flags,
            png: newFlag,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch updated country data to the Redux store
    dispatch(updateCountry(country)); // Assuming updateCountry is an action that updates the country in your store
    setIsEditing(false);
  };

  if (loading) return <div>Loading...</div>;

  const { latlng } = country || {};
  const [lat, lng] = latlng || [0, 0];

  const markerIcon = new Icon({
    iconUrl: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div>
      <button onClick={() => navigate('/')}>Back to List</button>

      {country && (
        <>
          <h1>{country.name.common}</h1>

          {isEditing ? (
            <div>
              <label>Flag:</label>
              {country.flag && (
                <img src={country.flags.png} alt="Current Flag" width="200" />
              )}
              <input type="file" accept="image/*" onChange={handleFlagChange} />
            </div>
          ) : (
            <div>
              <img src={country.flags.png} alt={country.name.common} width="200" />
            </div>
          )}

          <div className="country-info">
            <form onSubmit={handleSubmit}>
              <div>
                <label>Capital:</label>
                <input
                  type="text"
                  name="capital"
                  value={country.capital ? country.capital[0] : 'N/A'}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Region:</label>
                <input
                  type="text"
                  name="region"
                  value={country.region}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Sub region:</label>
                <input
                  type="text"
                  name="subregion"
                  value={country.subregion}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Population:</label>
                <input
                  type="text"
                  name="population"
                  value={country.population.toLocaleString()}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Area (in km²):</label>
                <input
                  type="number"
                  name="area"
                  value={country.area}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Currency:</label>
                <input
                  type="text"
                  name="currencies"
                  value={country.currencies && Object.keys(country.currencies).length > 0 ? 
                    `${country.currencies[Object.keys(country.currencies)[0]].symbol}` : 'N/A'}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div>
                <label>Timezones:</label>
                <input
                  type="text"
                  name="timezones"
                  value={country.timezones ? country.timezones.join(", ") : 'N/A'}
                  onChange={handleChange}
                  disabled
                />
              </div>
              {isEditing ? (
                <>
                  <button type="submit">Save</button>
                  <button type="button" onClick={handleEditToggle}>Cancel</button>
                </>
              ) : (
                <button type="button" onClick={handleEditToggle}>Edit</button>
              )}
            </form>
          </div>

          {latlng && (
            <>
              <h2>Location on the Map:</h2>
              <div style={{ width: '100%', height: '400px' }}>
                <MapContainer center={[lat, lng]} zoom={5} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[lat, lng]} icon={markerIcon}>
                    <Popup>
                      <b>{country.name.common}</b><br />
                      {country.capital ? `Capital: ${country.capital[0]}` : 'Capital: N/A'}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </>
          )}

          {borderingCountries.length > 0 && (
            <>
              <h3>Bordering Countries:</h3>
              <ul>
                {borderingCountries.map((borderCountry) => (
                  <li key={borderCountry.cca3}>
                    <Link to={`/country/${borderCountry.cca3}`}>
                      {borderCountry.name.common}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CountryDetails;
