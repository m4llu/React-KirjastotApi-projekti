import React, { useState } from 'react';

const Library = ({ library }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const sanitizeDescription = (description) => {
    // Remove HTML tags and &nbsp; from the description
    return description ? description.replace(/<[^>]*>|&nbsp;/g, '') : 'N/A';
  };

  // Define the maximum length for the description to display the "Näytä enemmän" button
  const maxDescriptionLength = 50; // You can adjust this value as needed

  return (
    <div className="library-item">
      <div className="library-image-container">
        <img src={library.coverPhoto.large.url} alt="Library" className="library-image" />
      </div>
      <div className="library-details">
        <h2>{library.name}</h2>
        <p><strong>Osoite:</strong> {library.address.street}, {library.address.postalCode}</p>
        <p><strong>Kaupunki:</strong> {library.address.city}</p>
        <p className={`description ${expanded ? 'expanded' : ''}`}>
          <strong>Kuvaus:</strong> {sanitizeDescription(library.description)}
        </p>
        {/* Check if description is longer than the maximum length to display the "Näytä enemmän" button */}
        {library.description && library.description !== 'N/A' && sanitizeDescription(library.description).length > maxDescriptionLength && (
          <button onClick={toggleDescription} className="expand-button">
            {expanded ? 'Näytä vähemmän' : 'Näytä enemmän'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Library;