import baseServiceApi from './baseServiceApi';

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

const getFlightsByFilter = async (from, to, before, after) => {
    let filter = "";
    if (from !== "") {
        filter += `from/${from.toUpperCase()}/`;
    }
    if (to !== "") {
        filter += `to/${to.toUpperCase()}/`;
    }
    if (before !== "") {
        filter += `before/${before}/`;
    }
    if (after !== "") {
        filter += `after/${after}/`;
    }
    try {
        // Fetch all flights
        const response = await baseServiceApi.get(`/flights_api/flights/${filter}`);


        return response.data;
    } catch (error) {
        console.error('Error during fetching flights:', error.response || error);
        throw error;
    }
};

const getFlightRoster = async (flightNumber) => {
    try {
        console.log(flightNumber);
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
        const response = await baseServiceApi.post(`/flights_api/flights/${flightNumber}/delete_roster/`);
        console.log(response);
        return response.data;
    }
    catch (error) {
        console.error('Error during fetching flights:', error.response || error);
        return [];
    }
}
const downloadSql = async (flightNumber) => {
    try {
        const response = await baseServiceApi.get(`/flights_api/flights/${flightNumber}/roster/sql`, {
            responseType: 'blob', // Important to receive response as blob
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `roster${flightNumber}.db`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }
    catch (error) {
        console.error('Error during fetching flights:', error.response || error);
        throw error;
    }
}
const downloadNoSql = async (flightNumber) => {
    try {
        const response = await baseServiceApi.get(`/flights_api/flights/${flightNumber}/roster/nosql`, {
            responseType: 'blob', // Important to receive response as blob
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `roster${flightNumber}.bson`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }
    catch (error) {
        console.error('Error during fetching flights:', error.response || error);
        throw error;
    }
}
const downloadJson = async (flightNumber) => {
    try {
        const response = await baseServiceApi.get(`/flights_api/flights/${flightNumber}/roster/json`, {
            responseType: 'blob', // Important to receive response as blob
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `roster${flightNumber}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }
    catch (error) {
        console.error('Error during fetching flights:', error.response || error);
        throw error;
    }
}
const manualGenerateFlightRoster = async (flightNumber, data) => {
    try {

        const response = await baseServiceApi.post(`/flights_api/flights/${flightNumber}/manual_generate_roster/`, data);
        console.log(response);
        return response.data;
    }
    catch (error) {
        return error.response.data.message;
    }

}

export const FlightApi = {
    getFlightsByID,
    getFlightsByFilter,
    getFlightRoster,
    generateFlightRoster,
    deleteFlightRoster,
    downloadSql,
    downloadNoSql,
    downloadJson,
    manualGenerateFlightRoster
};
