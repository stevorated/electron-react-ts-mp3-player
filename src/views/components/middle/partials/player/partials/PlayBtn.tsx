import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

type Props = {
    disabled: boolean;
    status: string;
    size: string;
    play: () => Promise<void>;
    pause: (stop?: boolean) => void;
};

export function PlayBtn({ disabled, size, status, play, pause }: Props) {
    const className = disabled ? 'disabled' : 'hoverable';
    return status !== 'playing' ? (
        <FaPlay
            className={`btn ${className}`}
            size={size}
            onClick={!disabled ? async () => await play() : () => {}}
        />
    ) : (
        <FaPause
            className={`btn ${className}`}
            size={size}
            onClick={!disabled ? () => pause() : () => {}}
        />
    );
}
