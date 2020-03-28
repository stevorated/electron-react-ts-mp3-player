import React from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer } from './store';

import App from './App';

const store = createStore(
    rootReducer,
    process.env.NODE_ENV === 'production'
        ? applyMiddleware(thunk)
        : composeWithDevTools(applyMiddleware(thunk))
);

export function Root() {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}
