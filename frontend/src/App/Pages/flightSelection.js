import React, { useState, useEffect } from 'react';
import './FlightSelectionPage.css';
import SelectedFlight from '../Components/selectedFlight';

function FlightSelectionPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [flightsData, setFlightsData] = useState([]);
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [outboundFlight, setOutboundFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);

  const API_URL = 'http://127.0.0.1:8000/api/flight_selection_api/';


  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((flight) => ({
          id: flight.flight_number,
          from: flight.flight_src.name,
          to: flight.flight_dest.name,
          date: flight.flight_date.split('T')[0],
          distance: flight.flight_distance,
          duration: flight.flight_duration,
          traineeLimit: flight.flight_trainee_limit,
        }));
        setFlightsData(formattedData);
      })
      .catch((error) => console.error('Error fetching flight data:', error));
  }, []);

  useEffect(() => {
    handleFilter();
  }, [from, to, date, returnDate, isRoundTrip, flightsData]);

  const handleFilter = () => {
    const outboundFiltered = flightsData.filter((flight) => {
      return (
        (!from || flight.from.includes(from)) &&
        (!to || flight.to.includes(to)) &&
        (!date || flight.date === date)
      );
    });

    const returnFiltered = isRoundTrip
      ? flightsData.filter((flight) => {
          return (
            (!from || flight.from.includes(to)) &&
            (!to || flight.to.includes(from)) &&
            (!returnDate || flight.date === returnDate)
          );
        })
      : [];

    setOutboundFlights(outboundFiltered);
    setReturnFlights(returnFiltered);
  };

  const handleSelectOutboundFlight = (flight) => {
    setOutboundFlight(flight);
  };

  const handleSelectReturnFlight = (flight) => {
    setReturnFlight(flight);
  };

  return (
    <div className="App">
      <h1>Flight Selection</h1>
      <div className="panel">
        <div className="panel-header">Filter Flights</div>
        <div className="panel-body">
          <div className="filter">
            <div className="filter-row">
              <label>
                One-Way
                <input
                  type="radio"
                  name="tripType"
                  checked={!isRoundTrip}
                  onChange={() => setIsRoundTrip(false)}
                />
              </label>
              <label>
                Round-Trip
                <input
                  type="radio"
                  name="tripType"
                  checked={isRoundTrip}
                  onChange={() => setIsRoundTrip(true)}
                />
              </label>
              <label>From</label>
              <input
                type="text"
                placeholder="From"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <label>To</label>
              <input
                type="text"
                placeholder="To"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <label>Departure Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {isRoundTrip && <label>Return Date</label>}
              {isRoundTrip && (
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flights">
        <div className="flights-column">
          <h2>Outbound Flights</h2>
          {outboundFlights.length > 0 ? (
            outboundFlights.map((flight) => (
              <div key={flight.id} className="flight">
                <input
                  type="radio"
                  id={`outbound-${flight.id}`}
                  name="outbound"
                  value={flight.id}
                  checked={outboundFlight && outboundFlight.id === flight.id}
                  onChange={() => handleSelectOutboundFlight(flight)}
                />
                <label htmlFor={`outbound-${flight.id}`}>
                  <p>From: {flight.from}</p>
                  <p>To: {flight.to}</p>
                  <p>Date: {flight.date}</p>
                  <p>Distance: {flight.distance} miles</p>
                  <p>Duration: {flight.duration}</p>
                  <p>Trainee Limit: {flight.traineeLimit}</p>
                </label>
              </div>
            ))
          ) : (
            <p>No outbound flights found</p>
          )}
        </div>
        {isRoundTrip && (
          <div className="flights-column">
            <h2>Return Flights</h2>
            {returnFlights.length > 0 ? (
              returnFlights.map((flight) => (
                <div key={flight.id} className="flight">
                  <input
                    type="radio"
                    id={`return-${flight.id}`}
                    name="return"
                    value={flight.id}
                    checked={returnFlight && returnFlight.id === flight.id}
                    onChange={() => handleSelectReturnFlight(flight)}
                  />
                  <label htmlFor={`return-${flight.id}`}>
                    <p>From: {flight.from}</p>
                    <p>To: {flight.to}</p>
                    <p>Date: {flight.date}</p>
                    <p>Distance: {flight.distance} miles</p>
                    <p>Duration: {flight.duration}</p>
                    <p>Trainee Limit: {flight.traineeLimit}</p>
                  </label>
                </div>
              ))
            ) : (
              <p>No return flights found</p>
            )}
          </div>
        )}
      </div>
      <SelectedFlight outboundFlight={outboundFlight} returnFlight={returnFlight} />
    </div>
  );
}

export default FlightSelectionPage;