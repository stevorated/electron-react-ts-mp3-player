import React from 'react';
import { FaForward, FaFastForward } from 'react-icons/fa';

type Props = {
    disabled: boolean;
    size: string;
    nextsong: () => void;
    forward: () => void;
};

export function ForwardBtns({ disabled, size, nextsong, forward }: Props) {
    const className = disabled ? 'disabled' : 'hoverable';
    return (
        <div>
            <FaForward
                className={`btn ${className}`}
                size={size}
                style={{ marginRight: '10px' }}
                onClick={forward}
            />
            <FaFastForward
                className={`btn ${className}`}
                size={size}
                onClick={nextsong}
            />
        </div>
    );
}
