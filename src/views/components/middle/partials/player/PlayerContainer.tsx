import React from 'react';

import { ISong } from '@services/db';
import {
    HandlerAction,
    TreeListType,
    StateHandlerAction,
} from '@views/interfaces';

import { MediaPanel } from './MediaPanel';
import { MediaPlayerWrap } from './MediaPlayerWrap';
import './PlayerContainer.style.less';

type Props = {
    status: string;
    pointer: number;
    waitBetween: number;
    current?: TreeListType;
    getPlayer: () => HTMLMediaElement | null;
    play: () => void;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function PlayerContainer({
    status,
    pointer,
    handleAction,
    current,
    getPlayer,
    play,
}: Props) {
    const nextsong = () => {
        if (current?.nested && pointer + 1 < current?.nested?.length) {
            const nextSongPointer = pointer + 1;
            handleAction('SET_STATUS', 'changing Song...');
            handleAction('CHANGE_SONG', nextSongPointer);
            play();
        } else {
            handleAction('SET_STATUS', 'end of list');
        }
    };

    const src = (current?.nested?.[pointer] as ISong)?.path || '';
    const size = '20px';
    const bigSize = '30px';

    return (
        <div className="container-audio centered transition border-bottom">
            <MediaPlayerWrap
                song={current?.nested[pointer] as ISong}
                status={status}
                nextsong={nextsong}
                handleAction={handleAction}
                getPlayer={getPlayer}
                pointer={pointer}
                src={src}
                size={size}
                bigSize={bigSize}
            />
            <MediaPanel
                pointer={pointer}
                handleAction={handleAction}
                playlistTitle={current?.title}
                songs={current?.nested as ISong[]}
            />
        </div>
    );
}
