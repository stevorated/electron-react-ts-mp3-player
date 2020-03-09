import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer } from './store';
import App from './App';

import './index.style.less';
import './assets/styles/style.less';

const store = createStore(
    rootReducer,
    process.env.NODE_ENV === 'production'
        ? applyMiddleware(thunk)
        : composeWithDevTools(applyMiddleware(thunk))
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
