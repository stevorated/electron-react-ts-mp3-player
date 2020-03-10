import React from 'react';

import { Explorer, Middle, Info, Status } from '../components';
import { TreeListType } from '../interfaces';
import { HandlerAction, StateHandlerAction } from '../interfaces';

type Props = {
    getPlayer: () => HTMLMediaElement;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload: any
    ) => void;
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
    tree,
    play,
    currentPlaylistId,
    pointer,
    waitBetween,
    status,
}: Props) {
    const [current] = tree.filter(
        item => item.type === 'playlist' && item.id === currentPlaylistId
    );

    return (
        <>
            <div className="fill-area flexbox-item-grow">
                <Explorer
                    currentPlaylistId={currentPlaylistId}
                    tree={tree}
                    handleAction={handleAction}
                />

                <Middle
                    getPlayer={getPlayer}
                    play={play}
                    current={current}
                    pointer={pointer}
                    status={status}
                    waitBetween={waitBetween}
                    handleAction={handleAction}
                />
                <Info />
            </div>
            <Status status={status} pointer={pointer} />
        </>
    );
}
