import React, { useState } from 'react';
import './landing.css';
import { FlightApi } from '../APIs/FlightApi';
import FlightCard from '../Components/flightCard';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFlight, setRoster } from '../../actions/flightActions';

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
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [rosterType, setRosterType] = useState('automatically');

    const navigate = useNavigate();
    const dispatch = useDispatch();



    const handleFlightSelect = (flight) => {
        setSelectedFlight(selectedFlight === flight ? null : flight);
    };

    const handleContinue = () => {
        dispatch(setFlight(selectedFlight));
        dispatch(setRoster(rosterType));
        if (rosterType === 'automatically') {
            navigate('/view');
        } else {
            navigate('/manualSelection');
        }
    };

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
            const data = searchType === 'flightInfo'
                ? await FlightApi.getFlightsByFilter(from, to, depart, returnDate)
                : await FlightApi.getFlightsByID(flightID);
            setFlights(data);
        } catch (error) {
            setError('Failed to fetch flights. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="landing-container">
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="search-options">
                    <label>
                        <input type="radio" value="flightInfo" checked={searchType === 'flightInfo'} onChange={handleSearchTypeChange} /> Flight info
                    </label>
                    <label>
                        <input type="radio" value="flightID" checked={searchType === 'flightID'} onChange={handleSearchTypeChange} /> Flight ID
                    </label>
                </div>
                {/* Fields for flight info or ID */}
                <div className="flight-info-fields">
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
                                    <i className="fas fa-calendar-alt"></i> Before
                                </label>
                                <input
                                    type="date"
                                    id="depart"
                                    placeholder="DD/MM/YYYY"
                                    value={depart}
                                    onChange={handleInputChange(setDepart)}
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="return">
                                    <i className="fas fa-calendar-alt"></i> After
                                </label>
                                <input
                                    type="date"
                                    id="return"
                                    placeholder=''
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
                </div>
                <button type="submit" className="search-button">Search</button>
            </form>
            <div className="flight-results">
                {isLoading ? <p>Loading...</p> : error ? <p className="error">{error}</p> : flights.map(flight => (
                    <div className={`flight-container ${selectedFlight === flight ? 'selected' : ''}`} key={flight.flight_number}>
                        <FlightCard flight={flight} onClick={() => handleFlightSelect(flight)} />
                        {selectedFlight === flight && (
                            <div className="roster-selection">
                                <div className="generate-roster">Generate Roster:</div>
                                <form onSubmit={handleContinue}>
                                    <div className="radio-group">
                                        <label>
                                            <input type="radio" name="rosterType" value="automatically" checked={rosterType === 'automatically'} onChange={() => setRosterType('automatically')} /> Automatically
                                        </label>
                                        <label>
                                            <input type="radio" name="rosterType" value="manually" checked={rosterType === 'manually'} onChange={() => setRosterType('manually')} /> Manually
                                        </label>
                                    </div>
                                    <button type="submit" className="submit-button">Continue</button>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LandingPage;
