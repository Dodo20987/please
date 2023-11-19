import React from 'react'

export default function TopSection() {
    return (
      <div className='top'>
        <h2 id = "top_header">TRAVEL COMPANION HUB</h2>
        <div className='feature-select-btn'>
          <button>Flights</button>
          <button>Hotels</button>
          <button>Weather</button>
          <button>Potentially remove</button>
        </div>
        <div className = "sign-up-support">
          <button>Help</button>
          <button>Login</button>
          <button id = "sign-up">Sign Up</button>
        </div>
      </div>
    );
  }