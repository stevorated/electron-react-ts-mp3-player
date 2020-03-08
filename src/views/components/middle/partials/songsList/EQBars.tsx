import React from 'react';
import { EQBar } from './EQBar';

import './EQBars.style.less';

type Props = { cols: number };

export function EQBars(props: Props) {
    const renderBars = () => {
        const arr = [];
        for (let i = 0; i < props.cols; i++) {
            arr.push(i);
        }
        return arr.map(col => <EQBar key={col} />);
    };

    return (
        <div className="container-audio centered border-bottom">
            {renderBars()}
        </div>
    );
}
