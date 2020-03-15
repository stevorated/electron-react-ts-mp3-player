import React from 'react';
import { FaStop } from 'react-icons/fa';

type Props = {
    size: string;
    pause: (stop?: boolean) => void;
};

export function StopBtn({ size, pause }: Props) {
    return (
        <FaStop
            size={size}
            className="btn hoverable"
            onClick={() => pause(true)}
        />
    );
}
