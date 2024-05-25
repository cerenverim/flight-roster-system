import axios from 'axios';

const baseServiceApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const setAuthToken = token => {
    console.log(token);
    if (token) {
        // Apply for every request
        baseServiceApi.defaults.headers.common['Authorization'] = `token ${token}`;
    } else {
        // Delete auth header
        delete baseServiceApi.defaults.headers.common['Authorization'];
    }
};

export default baseServiceApi;
