const initialState = {
    currentUser: null,
    token: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                currentUser: action.payload
            };
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.payload
            };
        case 'LOGOUT':
            return {
                ...initialState, // Reset to initial state
            };
        default:
            return state;
    }
};

export default userReducer;
