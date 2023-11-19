import React from 'react'

export default function SearchBar(props) {
    const { city, handleChange, handleSubmit, handleCountryCode, countryCode, } = props;
    return (
      <form className = "hotel-search-form" onSubmit = {handleSubmit}>
        <div className='new-search-container'>
            <p id = "search-title">Search for hotels</p>
          <div className = "search-input">
            <input 
            type = "text" 
            placeholder='Destination'
            value = {city}
            onChange={handleChange}
            />
            <input type = "text" 
            onChange={handleCountryCode}
            placeholder = "enter country code e.g CA"
              id = "country-code" 
              value = {countryCode} />
          </div>
          <button className='hotel-btn' type = "submit">Search</button>
        </div>
      </form>
    );
  }