import React from 'react';
import { PlayerContainer, SongsListContainer } from './partials';

import { IPlaylist } from '../../../services/db';

type Props = {
    playlists: IPlaylist[];
    currentPlaylistId: number;
};

export function Middle({ playlists, currentPlaylistId }: Props) {
    // console.log({ playlists, currentPlaylistId });
    return (
        <div className="flexbox-item-grow main">
            <PlayerContainer
                currentPlaylistId={currentPlaylistId}
                playlists={playlists}
            />
            <SongsListContainer
                currentPlaylistId={currentPlaylistId}
                playlists={playlists}
            />
        </div>
    );
}
