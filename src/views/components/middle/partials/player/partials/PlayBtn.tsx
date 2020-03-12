import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

type Props = {
    status: string;
    size: string;
    getPlayer: () => HTMLMediaElement | null;
};

export function PlayBtn({ size, getPlayer, status }: Props) {
    const player = getPlayer();
    return status !== 'playing' ? (
        <FaPlay
            className="btn hoverable"
            size={size}
            onClick={() => {
                player && player.play();
            }}
        />
    ) : (
        <FaPause
            className="btn hoverable"
            size={size}
            onClick={() => player && player.pause()}
        />
    );
}
