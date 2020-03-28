import React from 'react';
import { EQBar } from './EQBar';

import './EQBars.style.less';

export const EQBars = (props: { cols: number }) => {
    const renderBars = () => {
        const arr = [];
        for (let i = 0; i < props.cols; i++) {
            arr.push(i);
        }
        return arr.map(col => <EQBar key={col} />);
    };

    return <div className="container-audio centered">{renderBars()}</div>;
};
