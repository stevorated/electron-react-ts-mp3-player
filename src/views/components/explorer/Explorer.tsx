import React from 'react';

import { Playlists } from './partials';
import { PlaylistType, TreeListType } from '../../interfaces';
import { IPlaylist } from '../../../services/db';
import './Explorer.style.less';

type Props = {
    playlists: IPlaylist[];
    tree: TreeListType[];
    handleAction: (action: string, payload: any) => void;
};

export function Explorer(props: Props) {
    return (
        <aside className="flexbox-item-grow sidebar">
            <h1>…</h1>

            <Playlists tree={props.tree} handleAction={props.handleAction} />
        </aside>
    );
}
