export const setFlight = (flight) => {
    return {
        type: 'SET_FLIGHT',
        payload: flight
    };
};
export const setRoster = (rosterType) => {
    return {
        type: 'SET_ROSTER',
        payload: rosterType
    };
};
