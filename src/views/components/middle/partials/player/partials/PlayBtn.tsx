import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

type Props = {
    status: string;
    size: string;
    play: () => Promise<void>;
    pause: (stop?: boolean) => void;
};

export function PlayBtn({ size, status, play, pause }: Props) {
    return status !== 'playing' ? (
        <FaPlay
            className="btn hoverable"
            size={size}
            onClick={async () => await play()}
        />
    ) : (
        <FaPause
            className="btn hoverable"
            size={size}
            onClick={() => pause()}
        />
    );
}
