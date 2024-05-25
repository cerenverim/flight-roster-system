import React from 'react';

function SelectedFlight({ outboundFlight, returnFlight }) {
  return (
    <div className="selected-flight">
      <h2>Flight Detail Order</h2>
      {outboundFlight ? (
        <div className="flight-details">
          <h3>Outbound Flight</h3>
          <p>From: {outboundFlight.from}</p>
          <p>To: {outboundFlight.to}</p>
          <p>Date: {outboundFlight.date}</p>
          <p>Distance: {outboundFlight.distance} miles</p>
          <p>Duration: {outboundFlight.duration}</p>
          <p>Trainee Limit: {outboundFlight.traineeLimit}</p>
        </div>
      ) : (
        <p>No outbound flight selected</p>
      )}
      {returnFlight ? (
        <div className="flight-details">
          <h3>Return Flight</h3>
          <p>From: {returnFlight.from}</p>
          <p>To: {returnFlight.to}</p>
          <p>Date: {returnFlight.date}</p>
          <p>Distance: {returnFlight.distance} miles</p>
          <p>Duration: {returnFlight.duration}</p>
          <p>Trainee Limit: {returnFlight.traineeLimit}</p>
        </div>
      ) : (
        <p>No return flight selected</p>
      )}
    </div>
  );
}

export default SelectedFlight;