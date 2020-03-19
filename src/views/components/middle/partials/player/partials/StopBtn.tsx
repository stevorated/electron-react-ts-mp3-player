import React from 'react';
import { FaStop } from 'react-icons/fa';

type Props = {
    disabled: boolean;
    size: string;
    pause: (stop?: boolean) => void;
};

export function StopBtn({ disabled, size, pause }: Props) {
    const className = disabled ? 'disabled' : 'hoverable';
    return (
        <FaStop
            style={{ margin: '0 5px' }}
            size={size}
            className={`btn ${className}`}
            onClick={!disabled ? () => pause(true) : () => {}}
        />
    );
}
