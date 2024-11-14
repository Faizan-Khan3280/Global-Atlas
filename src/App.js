import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';  // Import your Redux store
import CountryList from './components/AllCountries';
import CountryDetails from './components/CountryDetails';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <h1>Welcome to the Global Atlas</h1>
          <Routes>
            <Route path="/" element={<CountryList />} />
            <Route path="/country/:countryCode" element={<CountryDetails />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
