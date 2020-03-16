import React from 'react';
import { FaFastBackward, FaBackward } from 'react-icons/fa';

type Props = {
    disabled: boolean;
    size: string;
    lastsong: () => void;
    rewind: () => void;
};

export function BackBtns({ disabled, size, rewind, lastsong }: Props) {
    const className = disabled ? 'disabled' : 'hoverable';
    return (
        <div style={{ alignItems: 'center' }}>
            <FaFastBackward
                className={`btn ${className}`}
                size={size}
                onClick={!disabled ? lastsong : () => {}}
            />
            <FaBackward
                className={`btn ${className}`}
                size={size}
                style={{ marginLeft: '10px' }}
                onClick={!disabled ? rewind : () => {}}
            />
        </div>
    );
}
