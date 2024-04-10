import React, { useState } from 'react';
import './App.css';
import Library from './components/library';
import logo from './logo.png';

  function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [libraries, setLibraries] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
      setError('');
      if (!searchTerm) {
        setError('Kirjoita hakusana.');
        return;
      }
      try {
        // searches with both city and name
        const citySearchUrl = `https://api.kirjastot.fi/v4/library?city.name=${encodeURIComponent(searchTerm)}`;
        const nameSearchUrl = `https://api.kirjastot.fi/v4/library?name=${encodeURIComponent(searchTerm)}`;

        const citySearchResponse = await fetch(citySearchUrl);
        const nameSearchResponse = await fetch(nameSearchUrl);

        if (!citySearchResponse.ok || !nameSearchResponse.ok) {
          throw new Error('Failed to fetch libraries');
        }

        const citySearchData = await citySearchResponse.json();
        const nameSearchData = await nameSearchResponse.json();

        const combinedLibraries = [...citySearchData.items, ...nameSearchData.items];

        setLibraries(combinedLibraries); // update to use the combined results
        setError(null); // clear any previous errors
      } catch (error) {
        console.error('Error fetching libraries:', error);
        setError('Error fetching libraries. Please try again later.');
        setLibraries([]); // clear in case of error
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    return (
      <div className="app">
        <header className="header">
          <img src={logo} className='google-logo'></img>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Etsi kirjaston tai kaupungin nimellä"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress} // add onKeyPress event handler
            />
            <button className="search-button" onClick={handleSearch}>Hae</button>
          </div>
        </header>
        <div className="library-list">
          {error && <p className="error-message">{error}</p>}
          {libraries.length > 0 ? (
            libraries.map(library => <Library key={library.id} library={library} />)
          ) : (
            <p></p>
          )}
        </div>
      </div>
    );
  }

  export default App;
