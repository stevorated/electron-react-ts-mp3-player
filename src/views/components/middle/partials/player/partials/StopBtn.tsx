import React from 'react';
import { FaStop } from 'react-icons/fa';

type Props = {
    size: string;
    getPlayer: () => HTMLMediaElement | null;
};

export function StopBtn({ size, getPlayer }: Props) {
    const player = getPlayer();
    return (
        <FaStop
            size={size}
            className="btn hoverable"
            onClick={() => {
                if (player) {
                    player.pause();
                    player.currentTime = 0;
                }
            }}
        />
    );
}
