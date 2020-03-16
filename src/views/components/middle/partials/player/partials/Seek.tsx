import React, { useRef } from 'react';
import dayjs from 'dayjs';

import './seek.style.less';

type Props = {
    disabled: boolean;
    pos: number;
    duration: number;
    handleChangePos: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Seek({ disabled, duration, pos, handleChangePos }: Props) {
    const seek = useRef<HTMLInputElement>(null);
    return (
        <>
            <label className={disabled ? 'disabled' : ''}>
                {!disabled ? dayjs(pos * 1000).format('mm:ss') : '--:--'}
            </label>
            <input
                disabled={disabled}
                className={`slider ${disabled ? 'disabled' : ''}`}
                name="seek"
                ref={seek}
                type="range"
                max={duration}
                value={pos * 1000}
                style={{ width: '250px', height: '5px' }}
                onDrop={() => console.log('eND')}
                onChange={handleChangePos}
            />
            <label className={disabled ? 'disabled' : ''}>
                {duration ? dayjs(duration).format('mm:ss') : '--:--'}
            </label>
        </>
    );
}
