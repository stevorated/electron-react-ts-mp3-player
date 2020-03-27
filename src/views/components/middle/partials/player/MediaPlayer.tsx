import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ISong } from '@services/db';
import { StatusType, AllHandlerActions } from '@views/interfaces';

import { Volume, Seek } from './player.partials';
import { Controls } from './Controls';

type Props = {
    status: StatusType;
    bigSize: string;
    size: string;
    pointer: number;
    song?: ISong;
    player: HTMLMediaElement | null;
    play: (dontRewind?: boolean) => Promise<void>;
    pause: (stop?: boolean) => void;
    nextsong: () => void;
    lastsong: () => void;
    rewind: () => void;
    forward: () => void;
    setCurrentTime: (time: number) => void;
    getCurrentTime: () => number;
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
};

export function MediaPlayer({
    handleAction,
    player,
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
    const container = useRef<HTMLDivElement>(null);
    const [volume, setVolume] = useState(0.5);
    const [pos, setPos] = useState(0);
    const [seek, setSeek] = useState(false);
    const [busy, setBusy] = useState(false);

    const noSong = !song;

    const updatePos = () => {
        if (!seek) {
            return setPos(getCurrentTime());
        }

        setSeek(false);
        setCurrentTime(pos);
    };

    const handleChangePos = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setSeek(true);
        setPos(e.target.valueAsNumber / 1000);
    };

    useEffect(() => {
        if (!player) {
            return;
        }
        player.addEventListener('timeupdate', updatePos);
        return () => player.removeEventListener('timeupdate', updatePos);
    });

    const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();

        if (!player) {
            return;
        }

        setVolume(e.target.valueAsNumber);
        player.volume = e.target?.valueAsNumber / 100;

        if (busy) {
            return;
        }

        setBusy(true);

        setTimeout(() => {
            setBusy(false);
            handleAction('SET_VOLUME', e.target.valueAsNumber / 100);
        }, 5000);
    };

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
