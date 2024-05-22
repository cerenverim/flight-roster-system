import baseServiceApi from './baseServiceApi';

const signUp = async (userData) => {
    try {
        const response = await baseServiceApi.post('/users/register', userData);
        return response.data;
    } catch (error) {
        // Handle errors here, like showing messages to the user
        console.error('Error during sign up:', error.response || error);
        throw error;
    }
};

const login = async (userData) => {
    try {
        const response = await baseServiceApi.post('/users/login', userData);
        return response.data;
    } catch (error) {
        // Handle errors here, like showing messages to the user
        console.error('Error during sign in:', error.response || error);
        throw error;
    }
};

export const AuthApi = {
    signUp,
    login
};
