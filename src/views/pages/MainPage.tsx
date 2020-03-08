import React from 'react';
import { Explorer, Middle, Info, Status } from '../components';
import { TreeListType } from '../interfaces';
import { IPlaylist, ISong } from '@services/db';
import { HandlerAction } from '../interfaces';

type Props = {
    handleAction: (action: HandlerAction, payload: any) => void;
    playlists: IPlaylist[];
    current?: IPlaylist;
    tree: TreeListType[];
    play: () => void;
    pointer: number;
    waitBetween: number;
    status: string;
};

export function MainPage({
    handleAction,
    playlists,
    tree,
    play,
    current,
    pointer,
    waitBetween,
    status,
}: Props) {
    return (
        <>
            <div className="fill-area flexbox-item-grow">
                <Explorer
                    handleAction={handleAction}
                    playlists={playlists}
                    tree={tree}
                />
                <Middle
                    status={status}
                    play={play}
                    handleAction={handleAction}
                    current={current}
                    pointer={pointer}
                    waitBetween={waitBetween}
                />
                <Info status={status} />
            </div>
            <Status current={current} status={status} pointer={pointer} />
        </>
    );
}
