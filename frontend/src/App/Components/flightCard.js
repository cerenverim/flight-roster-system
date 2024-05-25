import React from 'react';

function FlightCard({ flight }) {
    // Helper function to format the date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flight-card">
            <h2 className="flight-number">Flight Number: {flight.flight_number}</h2>
            {flight.shared_flight && (
                <div className="shared-flight-info">
                    Shared with: {flight.shared_flight.shared_flight_company} ({flight.shared_flight.shared_flight_number})
                </div>
            )}
            <div className="flight-details">
                <span>Date: {formatDate(flight.flight_date)}</span>
                <span>Duration: {flight.flight_duration.substring(0, 5)}</span>
                <span>From: {flight.flight_src}</span>
                <span>To: {flight.flight_dest}</span>
                <span>Distance: {flight.flight_distance} km</span>
                <span>Trainee Limit: {flight.flight_trainee_limit}</span>
                <span>Roster: {flight.flight_roster}</span>
                <span>Vehicle Type: {flight.vehicle_type}</span>
            </div>
        </div>
    );
}

export default FlightCard;
