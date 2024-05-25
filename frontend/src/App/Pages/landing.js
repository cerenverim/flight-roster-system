import React, { useState } from 'react';
import './landing.css';

function LandingPage() {
    const [searchType, setSearchType] = useState('flightID');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [depart, setDepart] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [flightID, setFlightID] = useState('');

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchType === 'flightInfo') {
            console.log(`Searching for flights from ${from} to ${to} departing on ${depart} and returning on ${returnDate}`);
        } else {
            console.log(`Searching for flight with ID: ${flightID}`);
        }
    };

    return (
        <div className="landing-container">
            
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