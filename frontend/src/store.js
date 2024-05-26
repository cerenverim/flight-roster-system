import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistStore, persistReducer } from 'redux-persist';

// Import your reducers here
import userReducer from './reducers/userReducer';

// Create a root reducer that will be wrapped by persistReducer
const rootReducer = combineReducers({
    user: userReducer,
    // you can add more reducers here
});

const persistConfig = {
    key: 'root', // The key for the persist
    storage, // The storage to use, 'localStorage' in this case
    whitelist: ['user'] // Only persist the user reducer
};

// Wrap the root reducer with persistReducer and the configuration
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Optional: adjust settings as necessary
        }),
    devTools: process.env.NODE_ENV !== 'production', // Automatically enable Redux DevTools in non-production environments
});

// Create a persistor object using persistStore
const persistor = persistStore(store);

export { store, persistor };
