import React, { useRef } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import './seek.style.less';

type Props = {
    width: number;
    disabled: boolean;
    pos: number;
    duration: number;
    handleChangePos: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Seek({
    width,
    disabled,
    duration,
    pos,
    handleChangePos,
}: Props) {
    const seek = useRef<HTMLInputElement>(null);
    return (
        <ContainerDiv>
            <label className={disabled ? 'disabled' : ''}>
                {!disabled ? dayjs(pos * 1000).format('mm:ss') : '--:--'}
            </label>
            <input
                disabled={disabled}
                className={`${disabled ? 'disabled' : ''}`}
                name="seek"
                ref={seek}
                type="range"
                max={duration}
                value={pos * 1000}
                style={{
                    // maxWidth: `${(width || 0) / 1.5}px`,
                    height: '5px',
                    margin: '0px 5px',
                }}
                onChange={handleChangePos}
            />
            <label className={disabled ? 'disabled' : ''}>
                {duration ? dayjs(duration).format('mm:ss') : '--:--'}
            </label>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 2.5;
    padding: 0 10px;
`;
