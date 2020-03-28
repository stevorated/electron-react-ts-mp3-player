import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IpcMainEvent } from 'electron';
import App from './App';
import { createStore, applyMiddleware } from 'redux';

import { rootReducer } from './store';

import './index.style.less';
import './assets/styles/style.less';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

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
