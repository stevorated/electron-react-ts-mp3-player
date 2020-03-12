import React from 'react';

import './volume.style.less';

type Props = {
    volume: number;
    player: HTMLMediaElement | null;
    handleChangeVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setVolume: (value: number) => void;
};

export function Volume({
    setVolume,
    volume,
    player,
    handleChangeVolume,
}: Props) {
    const currentVolume = player?.volume;
    if (currentVolume && currentVolume !== volume) {
        setVolume(currentVolume);
    }
    return (
        <input
            type="range"
            max={100}
            value={(currentVolume && currentVolume * 100) || volume}
            onChange={handleChangeVolume}
            style={{ width: '100px', height: '5px' }}
        />
    );
}
