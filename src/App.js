import React from 'react'
import './App.css';

function TopSection() {
  return (
    <div className='top'>
      <h2 id = "top_header">TRAVEL COMPANION HUB</h2>
      <div className='feature-select-btn'>
        <button>Flights</button>
        <button>Hotels</button>
        <button>Weather</button>
        <button>Points of interest</button>
      </div>
      <div className = "sign-up-support">
        <button>Help</button>
        <button>Login</button>
        <button id = "sign-up">Sign Up</button>
      </div>
    </div>
  );
}

function Filters() {
  return (
    <div class = "filter">
      <h1>Hotels</h1>
      <button id = "filter-btn">Filter</button>
    </div>
  );
}

function SearchBar(props) {
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

class Hotel_search extends React.Component {
  constructor(props) {
    super(props);
    //hotels contains all the names of the hotels
    this.state = {
      city: "",
      submit: "",
      hotels: [],
      countryCode: ""
    };
    // so that we can use "this" keyword in given methods
    this.handleChange = this.handleChange.bind(this);
    this.searchHotel = this.searchHotel.bind(this); 
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCountryCode = this.handleCountryCode.bind(this);

  }
  
  // when text is entered into input, city is given the text
  handleChange(event) {
    this.setState({
      city: event.target.value 
    });
  }

  handleCountryCode(event) {
    this.setState({
      countryCode: event.target.value
    });
  }
  handleSubmit(event) {
    //prevent default in order to not reload the web page after submitting
    event.preventDefault();
    this.setState({
      submit: this.state.city
    });
    // trigger the hotel search after the city has been inputted
    this.searchHotel();
  }

  // fetching data from amadeus api
  async searchHotel() {
    const baseUrl = "https://test.api.amadeus.com/v1/reference-data/locations/hotel";
    const Hotelurl = `${baseUrl}?keyword=${encodeURIComponent(this.state.city.toUpperCase())}&subType=HOTEL_LEISURE&countryCode=${encodeURIComponent(this.state.countryCode.toUpperCase())}&lang=EN&max=20`;
    
    //const apiKey = "xtU8VJK5vFf7wDosfi8Vs2PC2LahBwRZ";
    const token = "2FcR7cGTuAjjK8VZLmgZ36wGo6Jk";
    const headers = {
      Accept: "application/vnd.amadeus+json",
      Authorization: `Bearer ${token}`
    };
    
    try {
      const HotelResponse = await fetch(Hotelurl, {headers,
      method: "GET"});
      if (!HotelResponse.ok) {
        throw new Error('Failed to fetch hotels');
      }
      const HotelContent = await HotelResponse.json();
      this.setState({
        hotels: HotelContent.data
      });
    }
    catch(error) {
      console.error('Error fetching hotels:', error);
    }

  }
  // sample data for ratings is limited, therefore can't use sample data for testing purposes
  async getRating(hotelID) {
    const baseUrl = "test.api.amadeus.com/v2 ";
    const ratingURL = `${baseUrl}/e-reputation/hotel-sentiments?hotelIds=${encodeURIComponent(hotelID)}`;
    //const apiKey = "xtU8VJK5vFf7wDosfi8Vs2PC2LahBwRZ";
    const token = "2FcR7cGTuAjjK8VZLmgZ36wGo6Jk";
    const headers = {
      Accept: "application/vnd.amadeus+json",
      Authorization: `Bearer ${token}`
    };
    try {
      const response = await fetch(ratingURL, {headers,
      methods: "GET"});
      const ratingContent = await response.json();
      return ratingContent.data.overallRating;
    }
    catch(error) {
      console.error("Error, couldn't fetch ratings", error);
    }
    

  }
  /*
      curl "https://test.api.amadeus.com/v1/security/oauth2/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=xtU8VJK5vFf7wDosfi8Vs2PC2LahBwRZ&client_secret=Cc0DarAtHJsfKXZ0"


     copy and paste to get new access token for accessing api data
  */
  render() {
    return (
      <>
        <TopSection />
        <SearchBar city = {this.state.city} handleChange = {this.handleChange}
        handleSubmit = {this.handleSubmit} handleCountryCode = {this.handleCountryCode}
        countryCode = {this.state.countryCode}
        />
        <Filters />
        <div className= "scrollable-container">
        <div className="hotel-output">
          <ul className='horizontal-list'>
          {/*arr.map(element => (
            <li key = {element}>Testing this in order to work</li>
          ))*/}
          {this.state.hotels.map(element => (
            <li key = {element}>
              {element.address.cityName} - {element.name}
            </li>
          ))}
          </ul>
        </div>
        </div>
      </>
    );
  }
};
export default Hotel_search

