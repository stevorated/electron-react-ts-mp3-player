import React from 'react';

import { IPlaylist } from '@services/db';
import { HandlerAction } from '@views/interfaces';

import { PlayerContainer, SongsListContainer } from './partials';

type Props = {
    current?: IPlaylist;
    pointer: number;
    waitBetween: number;
    handleAction: (action: HandlerAction, payload?: any) => void;
    play: () => void;
    songsArr: string[];
    status: string;
};

export function Middle({
    current,
    pointer,
    waitBetween,
    handleAction,
    play,
    songsArr,
    status,
}: Props) {
    return (
        <div className="flexbox-item-grow main">
            <PlayerContainer
                current={current}
                songsArr={songsArr}
                pointer={pointer}
                play={play}
                handleAction={handleAction}
                waitBetween={waitBetween}
            />
            <SongsListContainer
                status={status}
                handleAction={handleAction}
                current={current}
                pointer={pointer}
            />
        </div>
    );
}
