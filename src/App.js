import React, { useState, useEffect } from 'react';
import './App.css';
import Library from './components/library';
import logo from './logo.png';
import logoWhite from './logoWhite.png';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [libraries, setLibraries] = useState([]);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); 

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background-color-light', isDarkMode ? '#1f1f1f' : '#ffffff');
    root.style.setProperty('--text-color-light', isDarkMode ? '#ffffff' : '#000000');
  }, [isDarkMode]);

  const handleSearch = async () => {
    setError('');
    if (!searchTerm) {
      setError('Kirjoita hakusana.');
      return;
    }
    try {
      const citySearchUrl = `https://api.kirjastot.fi/v4/library?city.name=${encodeURIComponent(searchTerm)}`;
      const nameSearchUrl = `https://api.kirjastot.fi/v4/library?name=${encodeURIComponent(searchTerm)}`;

      const citySearchResponse = await fetch(citySearchUrl);
      const nameSearchResponse = await fetch(nameSearchUrl);

      if (!citySearchResponse.ok || !nameSearchResponse.ok) {
        throw new Error('Failed to fetch libraries');
      }

      const citySearchData = await citySearchResponse.json();
      const nameSearchData = await nameSearchResponse.json();

      const uniqueLibraries = filterDuplicateLibraries(citySearchData.items, nameSearchData.items)
      setLibraries(uniqueLibraries);
      setError(null);
    } catch (error) {
      console.error('Error fetching libraries:', error);
      setError('Error fetching libraries. Please try again later.');
      setLibraries([]);
    }
  };

  const filterDuplicateLibraries = (cityLibraries, nameLibraries) => {
    const uniqueLibraries = [];
  
    cityLibraries.forEach(library => {
      // tarkistaa onko kirjasto jo listassa uniqueLibraries
      if (!uniqueLibraries.some(item => item.id === library.id)) {
        // jos ei ole, lisätään se
        uniqueLibraries.push(library);
      }
    });
  
    // tehdään sama asia myös nimihaulle
    nameLibraries.forEach(library => {
      if (!uniqueLibraries.some(item => item.id === library.id)) {
        uniqueLibraries.push(library);
      }
    });
  
    // palautetaan uniikit kirjastot
    return uniqueLibraries;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}> 
      <header className="header">
      <img src={isDarkMode ? logoWhite : logo} className='google-logo' alt="Logo"></img> 
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Etsi kirjaston tai kaupungin nimellä"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>Hae</button>
        </div>
        </header>
  
        <div className="library-list">
          {error && <p className="error-message">{error}</p>}
          {libraries.length > 0 ? (libraries.map((library, index) => (<Library key={`${library.id}-${index}`} library={library} />))
          ) : (
          <p>Kirjastoja ei löytynyt.</p>
          )}
        </div>
      <div className="void"></div>
          <footer className="footer">
          <button className="dark-mode-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <p>Powered by Google</p>
        </footer>
    </div>
  );
}

export default App;