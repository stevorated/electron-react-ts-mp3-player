import React, { useRef } from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer } from './store';

import App from './App';
import { AudioHandler } from './components/middle/partials/songsList/audioHandler';

const audioHandler = new AudioHandler();

const store = createStore(
    rootReducer,
    process.env.NODE_ENV === 'production'
        ? applyMiddleware(thunk)
        : composeWithDevTools(applyMiddleware(thunk))
);

const styles = {
    fillStyleSinewave: 'rgba(20, 20, 20)',
    fillStyleFrequency: 'rgba(20, 20, 20)',
    strokeStyleSinewave: 'rgba(255, 0, 0)',
    // strokeStyle: 'rgba(0, 0,255)',
    lineWidth: 1.5,
    level: 100,
    fftSize: 128, // delization of bars from 256 to 32768
};

export function Root() {
    const sinewaveC = useRef<HTMLCanvasElement>(null);
    const frequencyC = useRef<HTMLCanvasElement>(null);

    const handleLoadFiles = async (files: string[]) => {
        await audioHandler.loadFiles(
            files,
            { sinewaveC: sinewaveC.current, frequencyC: frequencyC.current },
            styles
        );
    };

    return (
        <Provider store={store}>
            <App
                sinewaveC={sinewaveC}
                frequencyC={frequencyC}
                audioHandler={audioHandler}
                handleLoadFiles={handleLoadFiles}
            />
        </Provider>
    );
}
