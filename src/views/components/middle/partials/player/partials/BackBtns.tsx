import React from 'react';
import { FaFastBackward, FaBackward } from 'react-icons/fa';

type Props = {
    size: string;
    lastsong: () => void;
    rewind: () => void;
};

export function BackBtns({ size, rewind, lastsong }: Props) {
    return (
        <div style={{ alignItems: 'center' }}>
            <FaFastBackward
                className="btn hoverable"
                size={size}
                onClick={lastsong}
            />
            <FaBackward
                className="btn hoverable"
                size={size}
                style={{ marginLeft: '10px' }}
                onClick={rewind}
            />
        </div>
    );
}
