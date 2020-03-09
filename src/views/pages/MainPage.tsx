import React from 'react';

import { IPlaylist } from '@services/db';

import { Explorer, Middle, Info, Status } from '../components';
import { TreeListType } from '../interfaces';
import { HandlerAction } from '../interfaces';

type Props = {
    getPlayer: () => HTMLMediaElement;
    handleAction: (action: HandlerAction, payload: any) => void;
    playlists: IPlaylist[];
    current?: IPlaylist;
    tree: TreeListType[];
    play: () => void;
    pointer: number;
    currentPlaylistId: number;
    waitBetween: number;
    status: string;
};

export function MainPage({
    getPlayer,
    handleAction,
    playlists,
    tree,
    play,
    current,
    currentPlaylistId,
    pointer,
    waitBetween,
    status,
}: Props) {
    return (
        <>
            <div className="fill-area flexbox-item-grow">
                <Explorer
                    currentPlaylistId={currentPlaylistId}
                    handleAction={handleAction}
                    playlists={playlists}
                    tree={tree}
                />

                <Middle
                    getPlayer={getPlayer}
                    status={status}
                    play={play}
                    handleAction={handleAction}
                    current={current}
                    pointer={pointer}
                    waitBetween={waitBetween}
                />
                <Info />
            </div>
            <Status current={current} status={status} pointer={pointer} />
        </>
    );
}
