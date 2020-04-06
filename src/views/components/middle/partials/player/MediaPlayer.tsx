import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ISong } from '@services/db';
import { StatusType, AllHandlerActions } from '@views/interfaces';

import { Volume, Seek } from './player.partials';
import { Controls } from './Controls';
import { AudioHandler } from '../songsList/audioHandler/AudioHandler';

type Props = {
    status: StatusType;
    bigSize: string;
    size: string;
    pointer: number;
    song?: ISong;
    player: AudioHandler;
    play: (dontRewind?: boolean) => Promise<void>;
    pause: (stop?: boolean) => void;
    nextsong: () => Promise<void>;
    lastsong: () => Promise<void>;
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
    const [pos, setPos] = useState(player.getPosition());
    const [seek, setSeek] = useState(false);
    const [busy, setBusy] = useState(false);

    const noSong = !song;

    useEffect(() => {
        setPos(player.getPosition());
    }, []);

    useEffect(() => {
        window.addEventListener('changeposition', updatePos);
        return () => {
            window.removeEventListener('changeposition', updatePos);
        };
    });

    const updatePos = () => {
        if (!seek) {
            return setPos(getCurrentTime());
        }
        setSeek(false);
        setCurrentTime(pos);
    };

    const handleChangePos = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();

        setBusy(true);

        if (busy) {
            return;
        }
        const playing = player.getStatus() === 'PLAY';
        setSeek(true);
        player.setPosition(e.target.valueAsNumber / 1000);
        playing && player.pause();
        setPos(e.target.valueAsNumber / 1000);
        setTimeout(() => {
            playing && player.play();
            setBusy(false);
        }, 2);
    };

    const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();

        setVolume(e.target.valueAsNumber);
        player.setVolume(e.target?.valueAsNumber / 100);

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
            <Seek disabled={noSong} pos={pos} duration={song?.length || 0} handleChangePos={handleChangePos} />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
`;
