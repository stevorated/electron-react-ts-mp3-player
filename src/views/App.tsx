import * as React from 'react';

import PageInterface from './interfaces/PageInterface';
// import img from './assets/img/cuttree.jpg';
// import font from './assets/img/Allerta-Regular.ttf';
import { Status, Info, Explorer, Middle } from './components';

import './App.style.less';

class App extends React.Component<PageInterface, {}> {
    render() {
        console.log('================', window);
        return (
            <>
                <div className="fill-area flexbox-item-grow">
                    <Explorer />
                    <Middle />
                    <Info />
                </div>
                <Status />
            </>
        );
    }
}

export default App;
