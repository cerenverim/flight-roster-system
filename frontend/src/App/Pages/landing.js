import React, { useState } from 'react';
import './landing.css';
import { FlightApi } from '../APIs/FlightApi';
import FlightCard from '../Components/flightCard';
function LandingPage() {


    const [searchType, setSearchType] = useState('flightID');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [depart, setDepart] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [flightID, setFlightID] = useState('');
    const [flights, setFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const handleSearchTypeChange = (event) => {
        setFlights([]);
        setSearchType(event.target.value);
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (searchType === 'flightInfo') {
                console.log(`Searching for flights from ${from} to ${to} departing on ${depart} and returning on ${returnDate}`);
                const filters = {
                    from,
                    to,
                    depart,
                    returnDate
                };
                const data = await FlightApi.getFlightsByFilter(filters);
                setFlights(data);
            } else {
                const data = await FlightApi.getFlightsByID(flightID);
                setFlights(data);
                console.log(`Searching for flight with ID: ${flightID}`);
            }
        } catch (error) {
            console.error('Error fetching flights:', error);
            setError('Failed to fetch flights. Please try again.');
        }
        setIsLoading(false);
    };


    return (
        <div className="landing-container">
            <header className="header">
                <h1>HOME</h1>
                <button className="user-button">USER</button>
            </header>
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="search-options">
                    <label>
                        <input
                            type="radio"
                            value="flightInfo"
                            checked={searchType === 'flightInfo'}
                            onChange={handleSearchTypeChange}
                        />
                        Flight info
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="flightID"
                            checked={searchType === 'flightID'}
                            onChange={handleSearchTypeChange}
                        />
                        Flight ID
                    </label>
                </div>
                {searchType === 'flightInfo' ? (
                    <div className="flight-info-fields">
                        <div className="form-field">
                            <label htmlFor="from">
                                <i className="fas fa-plane-departure"></i> From
                            </label>
                            <input
                                type="text"
                                id="from"
                                placeholder="Flight from?"
                                value={from}
                                onChange={handleInputChange(setFrom)}
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="to">
                                <i className="fas fa-plane-arrival"></i> To
                            </label>
                            <input
                                type="text"
                                id="to"
                                placeholder="Where to?"
                                value={to}
                                onChange={handleInputChange(setTo)}
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="depart">
                                <i className="fas fa-calendar-alt"></i> Depart
                            </label>
                            <input
                                type="text"
                                id="depart"
                                placeholder="DD/MM/YYYY"
                                value={depart}
                                onChange={handleInputChange(setDepart)}
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="return">
                                <i className="fas fa-calendar-alt"></i> Return
                            </label>
                            <input
                                type="text"
                                id="return"
                                placeholder="DD/MM/YYYY"
                                value={returnDate}
                                onChange={handleInputChange(setReturnDate)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="form-field">
                        <label htmlFor="flightID">
                            <i className="fas fa-plane"></i> Flight ID
                        </label>
                        <input
                            type="text"
                            id="flightID"
                            placeholder="Enter the flight ID you are searching for"
                            value={flightID}
                            onChange={handleInputChange(setFlightID)}
                        />
                    </div>
                )}
                <button type="submit" className="search-button"><i className="fas fa-search"></i> Search</button>
            </form>
        </div>
    );
}

export default LandingPage;