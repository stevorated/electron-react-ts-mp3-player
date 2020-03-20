import React from 'react';
import styled from 'styled-components';
import { FaStop } from 'react-icons/fa';

import { btnStyle } from '../../../../shared';

type Props = {
    disabled: boolean;
    size: string;
    pause: (stop?: boolean) => void;
};

export function StopBtn({ disabled, size, pause }: Props) {
    const className = disabled ? 'disabled' : 'hoverable';
    return (
        <Stop
            size={size}
            className={`btn ${className}`}
            onClick={!disabled ? () => pause(true) : () => {}}
        />
    );
}

const Stop = styled(FaStop)`
    ${btnStyle}
`;
