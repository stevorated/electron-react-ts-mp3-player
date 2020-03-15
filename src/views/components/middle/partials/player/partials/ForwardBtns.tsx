import React from 'react';
import { FaForward, FaFastForward } from 'react-icons/fa';

type Props = {
    size: string;
    nextsong: () => void;
    forward: () => void;
};

export function ForwardBtns({ size, nextsong, forward }: Props) {
    return (
        <div>
            <FaForward
                className="btn hoverable"
                size={size}
                style={{ marginRight: '10px' }}
                onClick={forward}
            />
            <FaFastForward
                className="btn hoverable"
                size={size}
                onClick={nextsong}
            />
        </div>
    );
}
