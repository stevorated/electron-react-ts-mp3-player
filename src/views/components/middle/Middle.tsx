import React from 'react';

import { IPlaylist } from '@services/db';
import { HandlerAction } from '@views/interfaces';

import { PlayerContainer, SongsListContainer } from './partials';

type Props = {
    status: string;
    pointer: number;
    waitBetween: number;
    current?: IPlaylist;

    handleAction: (action: HandlerAction, payload?: any) => void;
    getPlayer: () => HTMLMediaElement;
    play: () => void;
};

export function Middle({
    getPlayer,
    current,
    pointer,
    waitBetween,
    handleAction,
    play,
    status,
}: Props) {
    return (
        <div className="flexbox-item-grow main">
            <PlayerContainer
                getPlayer={getPlayer}
                status={status}
                current={current}
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
