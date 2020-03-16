import React from 'react';

import { ISong } from '@services/db';
import {
    TreeListType,
    HandlerAction,
    StateHandlerAction,
} from '@views/interfaces';

import { MediaPanel } from './MediaPanel';
import { MediaPlayer } from './MediaPlayer';
import './PlayerContainer.style.less';
import { Hr } from '../../../shared';

type Props = {
    status: string;
    pointer: number;
    waitBetween: number;
    loop: boolean;
    random: boolean;
    current?: TreeListType;
    getPlayer: () => HTMLMediaElement | null;
    play: (dontRewind?: boolean) => Promise<void>;
    pause: (stop?: boolean) => void;
    nextsong: () => void;
    lastsong: () => void;
    rewind: () => void;
    forward: () => void;
    setCurrentTime: (time: number) => void;
    getCurrentTime: () => number;
    addSongModal: () => void;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function PlayerContainer({
    handleAction,
    status,
    pointer,
    addSongModal,
    current,
    getPlayer,
    play,
    pause,
    nextsong,
    lastsong,
    rewind,
    forward,
    getCurrentTime,
    setCurrentTime,
    loop,
    random,
}: Props) {
    const size = '20px';
    const bigSize = '30px';

    return (
        <div className="container-audio centered transition padding-top">
            <MediaPlayer
                getPlayer={getPlayer}
                play={play}
                pause={pause}
                nextsong={nextsong}
                lastsong={lastsong}
                rewind={rewind}
                forward={forward}
                setCurrentTime={setCurrentTime}
                getCurrentTime={getCurrentTime}
                song={current?.nested[pointer] as ISong}
                status={status}
                pointer={pointer}
                size={size}
                bigSize={bigSize}
            />
            <Hr />
            <MediaPanel
            random={random}
                pointer={pointer}
                addSongModal={addSongModal}
                playlistTitle={current?.title}
                songs={current?.nested as ISong[]}
                loop={loop}
                handleAction={handleAction}
            />
            <Hr />
        </div>
    );
}
