import React, { useState, useEffect } from 'react';

const Library = ({ library }) => {
  const [expanded, setExpanded] = useState(false);
  const [postalCode, setPostalCode] = useState(library.address.zipcode || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const street = library.address.street;

    if (!postalCode && street) {
      setLoading(true);

      const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(street + ' ' + library.address.city + ' ' + library.address.area + ' ' + library.address.zipcode + ' ' + library.address.country)}&api_key=process.env.REACT_APP_MAPS_API_KEY`;

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data && data.results && data.results.length > 0) {
            const firstResult = data.results[0];
            setPostalCode(firstResult.zipcode);
          }
        })
        .catch(error => {
          console.error('Error fetching postal code:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [postalCode, library.address]);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const sanitizeDescription = (description) => {
    return description ? description.replace(/<[^>]*>|&nbsp;/g, '') : 'N/A';
  };

  const maxDescriptionLength = 70;

  return (
    <div className="library-item">
      <div className="library-image-container">
        {library.coverPhoto && library.coverPhoto.large && (
          <img src={library.coverPhoto.large.url} alt="Library" className="library-image" />
        )}
      </div>
      <div className="library-details">
        <h2>{library.name}</h2>
        <p>
          <strong>Osoite:</strong> {library.address.street}, {library.address.city} {postalCode}
          {loading && <span> (Fetching postal code...)</span>}
        </p>
        <p className={`description ${expanded ? 'expanded' : ''}`}>
          <strong>Description:</strong> {sanitizeDescription(library.description)}
        </p>
        {library.description && library.description !== 'N/A' && sanitizeDescription(library.description).length > maxDescriptionLength && (
          <button onClick={toggleDescription} className="expand-button">
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Library;