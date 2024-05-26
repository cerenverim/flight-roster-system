import baseServiceApi from './baseServiceApi';

const FL0001 = "FL0001";
const getFlightsByID = async (flightNumber) => {
    try {
        // Fetch all flights
        const response = await baseServiceApi.get('/flights_api/flights');
        console.log(response);

        // Filter flights based on flightNumber provided
        if (flightNumber !== "") {
            const filteredFlights = response.data.filter(flight => flight.flight_number === flightNumber);
            console.log(filteredFlights);
            return filteredFlights;
        } else {
            return response.data;
        }

    } catch (error) {
        // Handle errors here, like showing messages to the user
        console.error('Error during flight info:', error.response || error);
        throw error;
    }
};

const getFlightsByFilter = async (filters) => {
    console.log("Filters applied:", filters);
    try {
        // Fetch all flights
        const response = await baseServiceApi.get('/flights_api/flights');
        const allFlights = response.data;

        // Filter flights based on the provided filters
        const filteredFlights = allFlights.filter(flight => {
            // Check each filter criteria; return true if flight matches all non-empty filter fields
            return (!filters.from || flight.flight_src === filters.from) &&
                (!filters.to || flight.flight_dest === filters.to) &&
                (!filters.depart || new Date(flight.flight_date).toDateString() === new Date(filters.depart).toDateString()) &&
                (!filters.returnDate || (flight.return_date && new Date(flight.return_date).toDateString() === new Date(filters.returnDate).toDateString()));
        });

        return filteredFlights;
    } catch (error) {
        console.error('Error during fetching flights:', error.response || error);
        throw error;
    }
};

const getFlightRoster = async (flightNumber) => {
    try {
        const response = await baseServiceApi.get(`/flights_api/flights/${flightNumber}/roster/`);
        console.log(response);
        return response.data;

    }
    catch (error) {
        console.error('Error during fetching flights:', error.response || error);
        return [];
    }
}

const generateFlightRoster = async (flightNumber) => {
    try {
        const response = await baseServiceApi.post(`/flights_api/flights/${flightNumber}/auto_generate_roster/`);
        console.log(response);
        return response.data;

    }
    catch (error) {
        console.error('Error during fetching flights:', error.response || error);
        return [];
    }
}

const deleteFlightRoster = async (flightNumber) => {
    try {
        const response = await baseServiceApi.delete(`/flights_api/flights/${FL0001}/delete_roster/`);
        console.log(response);
        return response.data;

    }
    catch (error) {
        console.error('Error during fetching flights:', error.response || error);
        throw error;
    }
}

export const FlightApi = {
    getFlightsByID,
    getFlightsByFilter,
    getFlightRoster,
    generateFlightRoster,
    deleteFlightRoster
};
