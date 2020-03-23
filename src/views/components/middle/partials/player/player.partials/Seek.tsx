import React, { useRef } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { RangeInput } from '../../../../shared';

type Props = {
    disabled: boolean;
    pos: number;
    duration: number;
    handleChangePos: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Seek({ disabled, duration, pos, handleChangePos }: Props) {
    const seek = useRef<HTMLInputElement>(null);
    return (
        <ContainerDiv>
            <TimeLabel className={disabled ? 'disabled' : ''}>
                {!disabled ? dayjs(pos * 1000).format('mm:ss') : '--:--'}
            </TimeLabel>
            <RangeInput
                disabled={disabled}
                className={`${disabled ? 'disabled' : ''}`}
                name="seek"
                ref={seek}
                type="range"
                max={duration}
                value={pos * 1000}
                onChange={handleChangePos}
            />
            <TimeLabel className={disabled ? 'disabled' : ''}>
                {duration ? dayjs(duration).format('mm:ss') : '--:--'}
            </TimeLabel>
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

const TimeLabel = styled.label`
    white-space: nowrap;
`;
