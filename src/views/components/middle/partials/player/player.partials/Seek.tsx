import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { RangeInput, Tooltip } from '../../../../shared';

type Props = {
    disabled: boolean;
    pos: number;
    duration: number;
    handleChangePos: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Seek({ disabled, duration, pos, handleChangePos }: Props) {
    const [temp, setTemp] = useState(pos);
    const seek = useRef<HTMLInputElement>(null);
    const currentTime = dayjs(pos * 1000).format('mm:ss');
    const tempTime = dayjs(temp).format('mm:ss');
    const handleTempValue = (e: React.MouseEvent) => {
        if (!seek.current) {
            return;
        }

        const ratio = e.nativeEvent.offsetX / seek.current.clientWidth;

        if (ratio < 0) {
            setTemp(0);
        }

        if (ratio > 1) {
            setTemp(1);
        }

        setTemp(duration * ratio);
    };
    return (
        <ContainerDiv>
            <InnerContainerDiv>
                <TimeLabel className={disabled ? 'disabled' : ''}>{!disabled ? currentTime : '--:--'}</TimeLabel>
                <Tooltip tooltipText={tempTime || currentTime} style={{ width: '80%' }}>
                    <RangeInput
                        onMouseMove={handleTempValue}
                        disabled={disabled}
                        className={`${disabled ? 'disabled' : ''}`}
                        name="seek"
                        ref={seek}
                        type="range"
                        max={duration}
                        value={pos * 1000}
                        onChange={handleChangePos}
                    />
                </Tooltip>
                <TimeLabel style={{ marginLeft: '20px' }} className={disabled ? 'disabled' : ''}>
                    {duration ? dayjs(duration).format('mm:ss') : '--:--'}
                </TimeLabel>
            </InnerContainerDiv>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    /* display: flex; */
    justify-content: 'flex-start';
    align-items: center;
    flex: 2.5;
    /* width: 100%; */
    padding: 0 10px;
`;
const InnerContainerDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    /* flex: 2.5; */
    padding: 0 10px;
`;

const TimeLabel = styled.label`
    white-space: nowrap;
`;
