import React, { useRef } from 'react';
import dayjs from 'dayjs';

import './seek.style.less';

type Props = {
    pos: number;
    duration: number;
    handleChangePos: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Seek({ duration, pos, handleChangePos }: Props) {
    const seek = useRef<HTMLInputElement>(null);
    return (
        <>
            <label>{dayjs(pos * 1000).format('mm:ss')}</label>
            <input
                className="slider"
                name="seek"
                ref={seek}
                type="range"
                max={duration}
                value={pos * 1000}
                style={{ width: '250px', height: '5px' }}
                onDrop={() => console.log('eND')}
                onChange={handleChangePos}
            />
            <label>
                {duration ? dayjs(duration).format('mm:ss') : '00:00'}
            </label>
        </>
    );
}
