import React from 'react'
import './App.css';
import TopSection from './top_bar';


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

function Filters() {
  return (
    <div class = "filter">
      <h1>Hotels</h1>
      <button id = "filter-btn">Filter</button>
    </div>
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
      countryCode: "",
      cityCode : "",
      hotelIds : [],
      hotelPriceData: []
    };
    // so that we can use "this" keyword in given methods
    this.handleChange = this.handleChange.bind(this);
    this.searchHotel = this.searchHotel.bind(this); 
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCountryCode = this.handleCountryCode.bind(this);
    this.getRating = this.getRating.bind(this);

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
    
    //const apiKey = "cE2jGPVityfQ3dlJQV9Uwvb13NxR";
    const token = "NAg96NsPv90yZ090r6Ov2K8GDk0S";
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
        cityCode: HotelContent.data[0].iataCode
      }, () => {
        this.getRating();
      });
      
    }
    catch(error) {
      console.error('Error fetching hotels:', error);
    }

  }
  async getPrice() {
    const token = "NAg96NsPv90yZ090r6Ov2K8GDk0S";
    const baseUrl = "https://test.api.amadeus.com/v3";
    const hotelIdList = this.state.hotelIds.join(',')
    const URL = `${baseUrl}/shopping/hotel-offers?hotelIds=${encodeURIComponent(hotelIdList)}&checkInDate=2023-11-22&roomQuantity=1&paymentPolicy=NONE&bestRateOnly=false`;
    const headers = {
      Accept: "application/vnd.amadeus+json",
      Authorization: `Bearer ${token}`
    };
    try {
      const response = await fetch(URL, {headers,
      method : "GET"});
      const content = await response.json();
      /* 
         in order to print the price of the hotel onto the web page:
         create a non state variable hashmap in the class hotel_search. 
         the keys will be the name of the city, and use a loop to check if the hotelID from hotel list and
         this api match. If the hotelIDS match then the value of the key will be hotelPriceData object.
         To print to screen <> {element.name} - {map.element.name.price}
      */
      this.setState({
        hotelPriceData : content.data
      });

    }
    catch(error) {
      console.error("error, couldn't fetch the prices")
    }
  }

  // sample data for ratings is limited, therefore can't use sample data for testing purposes
  async getRating() {
    const baseUrl = "https://test.api.amadeus.com/v1";
    //const ratingURL = `${baseUrl}/e-reputation/hotel-sentiments?hotelIds=${encodeURIComponent(hotelID)}`;
    const ratingURL = `${baseUrl}/reference-data/locations/hotels/by-city?cityCode=${encodeURIComponent(this.state.cityCode.toLowerCase())}&radius=10&radiusUnit=KM&ratings=2,3,4,5&hotelSource=ALL`;
    //const apiKey = "cE2jGPVityfQ3dlJQV9Uwvb13NxR";
    const token = "NAg96NsPv90yZ090r6Ov2K8GDk0S";
    const headers = {
      Accept: "application/vnd.amadeus+json",
      Authorization: `Bearer ${token}`
    };
    try {
      const response = await fetch(ratingURL, {headers,
      method: "GET"});
      const ratingContent = await response.json();
      this.setState({
        hotels: ratingContent.data
      });
      console.log("update2")
      
    }
    catch(error) {
      console.error("Error fetching ratings:", error);
    }
    

  }
  /*
      curl "https://test.api.amadeus.com/v1/security/oauth2/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=xtU8VJK5vFf7wDosfi8Vs2PC2LahBwRZ&client_secret=Cc0DarAtHJsfKXZ0"


     copy and paste to get new access token for accessing api data
  */
  render() {
    const uniqueHotelNames = new Set();

    // Filter the array to get unique hotel names and map over them
    const uniqueHotels = this.state.hotels.filter(hotel => {
      if (!uniqueHotelNames.has(hotel.name)) {
        uniqueHotelNames.add(hotel.name);
        return true; // Include the hotel in the filtered array
      }
      return false; // Exclude duplicates
    });
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
          {uniqueHotels.map(element => (
            <li key = {element}>
              {this.state.submit.toUpperCase()} - {element.name}
              <span className = "rating">
                <p>ratings: {element.rating}/5 </p>
              </span>
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

