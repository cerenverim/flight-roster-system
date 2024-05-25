export const setUser = (user) => {
    return {
        type: 'SET_USER',
        payload: user
    };
};
export const setToken = (token) => {
    return {
        type: 'SET_TOKEN',
        payload: token
    };
};
