import React from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause } from 'react-icons/fa';

import { StatusType } from '@views/interfaces';

import { btnStyle } from '../../../../shared';

type Props = {
    disabled: boolean;
    status: StatusType;
    size: string;
    play: () => Promise<void>;
    pause: (stop?: boolean) => void;
};

export function PlayBtn({ disabled, size, status, play, pause }: Props) {
    const className = disabled ? 'disabled' : 'hoverable';
    return status !== 'playing' && status !== 'waiting...' ? (
        <Play
            className={`btn ${className}`}
            size={size}
            onClick={!disabled ? async () => await play() : () => {}}
        />
    ) : (
        <Pause
            className={`btn ${className}`}
            size={size}
            onClick={!disabled ? () => pause() : () => {}}
        />
    );
}

const Pause = styled(FaPause)`
    ${btnStyle}
`;

const Play = styled(FaPlay)`
    ${btnStyle}
`;
