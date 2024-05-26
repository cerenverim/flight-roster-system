const initialState = {
    selectedFlight: null,
    rosterType: null,
};

const flightReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SELECTED_FLIGHT':
            return {
                ...state,
                selectedFlight: action.payload
            };
        case 'SET_ROSTER_TYPE':
            return {
                ...state,
                rosterType: action.payload
            };
        default:
            return state;
    }
};

export default flightReducer;
