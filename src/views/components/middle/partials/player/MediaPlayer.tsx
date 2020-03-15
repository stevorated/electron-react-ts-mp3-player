import React, { useState, useEffect } from 'react';

import { ISong } from '@services/db';

import { Volume, Seek, PlayBtn, StopBtn } from './partials';
import { ForwardBtns, BackBtns } from './partials';

type Props = {
    status: string;
    bigSize: string;
    size: string;
    pointer: number;
    song: ISong;
    play: (dontRewind?: boolean) => Promise<void>;
    pause: (stop?: boolean) => void;
    nextsong: () => void;
    lastsong: () => void;
    rewind: () => void;
    forward: () => void;
    setCurrentTime: (time: number) => void;
    getCurrentTime: () => number;
    getPlayer: () => HTMLMediaElement | null;
};

export function MediaPlayer({
    getPlayer,
    play,
    pause,
    nextsong,
    lastsong,
    rewind,
    forward,
    setCurrentTime,
    getCurrentTime,
    bigSize,
    size,
    status,
    song,
}: Props) {
    const player = getPlayer();

    const [volume, setVolume] = useState(0);
    const [pos, setPos] = useState(0);
    const [seek, setSeek] = useState(false);

    const updatePos = () => {
        if (!seek) {
            return setPos(getCurrentTime());
        }

        setSeek(false);
        console.log('here', pos);
        setCurrentTime(pos);
    };

    const handleChangePos = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeek(true);
        setPos(e.target.valueAsNumber / 1000);
    };

    const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!player) {
            return;
        }

        setVolume(e.target.valueAsNumber);
        player.volume = e.target.valueAsNumber / 100;
    };

    useEffect(() => {
        if (!player) {
            return;
        }
        player.addEventListener('timeupdate', updatePos);
        return () => player.removeEventListener('timeupdate', updatePos);
    });

    return (
        <div className="media-player-wrap">
            <Volume
                setVolume={setVolume}
                handleChangeVolume={handleChangeVolume}
                player={player}
                volume={volume}
            />
            <BackBtns size={size} lastsong={lastsong} rewind={rewind} />
            <StopBtn size={bigSize} pause={pause} />
            <PlayBtn pause={pause} play={play} size={bigSize} status={status} />
            <ForwardBtns forward={forward} nextsong={nextsong} size={size} />
            <Seek
                pos={pos}
                duration={song?.length}
                handleChangePos={handleChangePos}
            />
        </div>
    );
}
