import React, { useState, useEffect } from 'react';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';
import { ISong } from '@services/db';

import { MediaPlayer } from './MediaPlayer';
import { Volume } from './partials/Volume';
import { BackBtns } from './partials/BackBtns';
import { PlayBtn } from './partials/PlayBtn';
import { StopBtn } from './partials/StopBtn';
import { ForwardBtns } from './partials/ForwardBtns';
import { Seek } from './partials/Seek';

type Props = {
    status: string;
    src: string;
    bigSize: string;
    size: string;
    pointer: number;
    song: ISong;
    getPlayer: () => HTMLMediaElement | null;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
    nextsong: () => void;
};

export function MediaPlayerWrap(props: Props) {
    const {
        src,
        bigSize,
        size,
        getPlayer,
        pointer,
        handleAction,
        nextsong,
        status,
        song,
    } = props;

    const player = getPlayer();
    const [volume, setVolume] = useState(0);
    const [pos, setPos] = useState(0);
    const [seek, setSeek] = useState(false);

    const updatePos = () => {
        if (!player) {
            return;
        }

        if (!seek) {
            return setPos(player.currentTime);
        }

        setSeek(false);
        player.currentTime = pos;
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
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
            }}
        >
            <Volume
                setVolume={setVolume}
                handleChangeVolume={handleChangeVolume}
                player={player}
                volume={volume}
            />
            <BackBtns
                status={status}
                pointer={pointer}
                size={size}
                handleAction={handleAction}
                getPlayer={getPlayer}
            />
            <PlayBtn getPlayer={getPlayer} size={bigSize} status={status} />
            <MediaPlayer
                pointer={pointer}
                handleAction={handleAction}
                src={src}
                nextsong={nextsong}
            />
            <Seek
                pos={pos}
                duration={song?.length}
                handleChangePos={handleChangePos}
            />
            <StopBtn size={bigSize} getPlayer={getPlayer} />
            <ForwardBtns
                pointer={pointer}
                size={size}
                getPlayer={getPlayer}
                handleAction={handleAction}
            />
        </div>
    );
}
