export const setSelectedFlight = (flight) => {
    return {
        type: 'SET_SELECTED_FLIGHT',
        payload: flight
    };
};
export const setRosterType = (rosterType) => {
    return {
        type: 'SET_ROSTER_TYPE',
        payload: rosterType
    };
};
