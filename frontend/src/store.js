import { configureStore } from '@reduxjs/toolkit';

// Import your reducers here
import userReducer from './reducers/userReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
        // you can add more reducers here
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false, // Optional: adjust settings as necessary
    }),
    devTools: process.env.NODE_ENV !== 'production', // Automatically enable Redux DevTools in non-production environments
});

export default store;
