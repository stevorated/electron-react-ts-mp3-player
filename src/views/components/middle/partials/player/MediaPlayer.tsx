import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ISong } from '@services/db';

import { Volume, Seek } from './partials';
import { Controls } from './Controls';

type Props = {
    status: string;
    bigSize: string;
    size: string;
    pointer: number;
    song?: ISong;
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
    const container = useRef<HTMLDivElement>(null);
    const [volume, setVolume] = useState(50);
    const [pos, setPos] = useState(0);
    const [seek, setSeek] = useState(false);
    const noSong = !song;

    const updatePos = () => {
        if (!seek) {
            return setPos(getCurrentTime());
        }

        setSeek(false);
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
        <ContainerDiv ref={container}>
            <Volume
                disabled={noSong}
                setVolume={setVolume}
                handleChangeVolume={handleChangeVolume}
                player={player}
                volume={volume}
            />
            <Controls
                status={status}
                noSong={noSong}
                size={size}
                bigSize={bigSize}
                play={play}
                pause={pause}
                nextsong={nextsong}
                lastsong={lastsong}
                rewind={rewind}
                forward={forward}
            />
            <Seek
                disabled={noSong}
                pos={pos}
                duration={song?.length || 0}
                handleChangePos={handleChangePos}
            />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
`;
