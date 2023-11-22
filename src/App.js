import React from 'react'
import './App.css';
import TopSection from './top_bar';

// to get access token
var global_token;
const getToken = async () => {
    const apiUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    const clientId = 'xtU8VJK5vFf7wDosfi8Vs2PC2LahBwRZ';
    const clientSecret = 'Cc0DarAtHJsfKXZ0';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        //console.log('Token:', token);
        return token;
      } else {
        console.error('Failed to retrieve token:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error during token retrieval:', error);
    }
  };


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
      hotels: [], // get rate
      countryCode: "",
      cityCode : "",
      hotelPriceData: [],
      hotelContent: [],
      hotelPrice: [] // get price
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
    getToken().then(token =>{
      global_token = token;
      this.searchHotel();
    }).catch(error => {console.error("error couldn't get token", error)});
    
  }

  // fetching data from amadeus api
  async searchHotel() {
    const baseUrl = "https://test.api.amadeus.com/v1/reference-data/locations/hotel";
    const URL = `${baseUrl}?keyword=${encodeURIComponent(this.state.city.toUpperCase())}&subType=HOTEL_LEISURE&countryCode=${encodeURIComponent(this.state.countryCode.toUpperCase())}&lang=EN&max=20`;
    
    //const apiKey = "cE2jGPVityfQ3dlJQV9Uwvb13NxR";
    //const token = "yFMG91Fp7GdxPkT4pcj7Di1KfZI3";
    const headers = {
      Accept: "application/vnd.amadeus+json",
      Authorization: `Bearer ${global_token}`
    };
    
    try {
      const response = await fetch(URL, {headers,
      method: "GET"});
      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }
      const content = await response.json();
      this.setState({
        cityCode: content.data[0].iataCode,
        hotelContent : content.data
      }, () => {
        this.getRating();
      });
      
    }
    catch(error) {
      console.error('Error fetching hotels:', error);
    }

  }

  async getPrice() {
    //const token = "yFMG91Fp7GdxPkT4pcj7Di1KfZI3";
    let len = 0;
    if(this.state.hotels.length > 175) {
      len = 175;
    }
    else if(this.state.hotels.length <= 175) {
      len = this.state.hotels.length;
    }
    let IDs = [];
      for(let i = 0; i < len; i++) {
            IDs.push(this.state.hotels[i].hotelId);
    }

    const baseUrl = "https://test.api.amadeus.com/v3";
    const IdList = IDs.join(',');
    const URL = `${baseUrl}/shopping/hotel-offers?hotelIds=${encodeURIComponent(IdList)}&checkInDate=2023-11-22&roomQuantity=1&paymentPolicy=NONE&bestRateOnly=false`;    //const URL = `${baseUrl}/shopping/hotel-offers?hotelIds=${encodeURIComponent(hotelIdList)}&checkInDate=2023-11-22&roomQuantity=1&paymentPolicy=NONE&bestRateOnly=false`;
    const headers = {
      Accept: "application/vnd.amadeus+json",
      Authorization: `Bearer ${global_token}`
    };
    try {
      const response = await fetch(URL, {headers,
      method : "GET"});
      const content = await response.json();
      this.setState({
        hotelPrice : content.data
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
    //const token = "yFMG91Fp7GdxPkT4pcj7Di1KfZI3";
    const headers = {
      Accept: "application/vnd.amadeus+json",
      Authorization: `Bearer ${global_token}`
    };
    try {
      const response = await fetch(ratingURL, {headers,
      method: "GET"});
      const ratingContent = await response.json();
      this.setState({
        hotels: ratingContent.data
      }, () =>{
        this.getPrice()
      });
      
      
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
    let res = [];
    var index = 0;
        for(let i = 0; i < this.state.hotelPrice.length; i++) {
            for(let k = 0; k < this.state.hotels.length; k++) {
                if(this.state.hotelPrice[i].hotel.hotelId === this.state.hotels[k].hotelId) {
                    res.push(this.state.hotelPrice[i]);
                    res[index].rating = this.state.hotels[k].rating;
                    index++;
                } 
            }
        }
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
          {res.map(element => (
            <li key = {element}>
              {element.hotel.cityCode} - {element.hotel.name}
              <span className = "rating">
                <p>ratings: {element.rating}/5 </p>
                <p>price: ${element.offers[0].price.total} {element.offers[0].price.currency}</p>
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

