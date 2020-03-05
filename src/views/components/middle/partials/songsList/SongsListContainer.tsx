import React, { useState, useEffect } from 'react';
import { EQBars } from './EQBars';
import { Songs } from './Songs';
// import { playlistsMock } from '../../../../constants/mocks';
import { IPlaylist } from '../../../../../services/db';

type Props = {
    playlists: IPlaylist[];
    currentPlaylistId: number;
};

export function SongsListContainer({ playlists, currentPlaylistId }: Props) {
    // console.log({ playlists, currentPlaylistId });
    const [width, setWidth] = useState(window.innerWidth);
    const [songs] = playlists
        ?.filter(pl => {
            if (typeof pl.id === 'number') return pl.id === currentPlaylistId;
        })
        ?.map(pl => pl.songs);

    const updateWidth = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    });
    // const { songs } = playlistsMock[0];
    return (
        <div className="main-body playlist-container">
            <EQBars cols={Math.round((width - 300) / 41)} />
            <Songs rows={17} songs={songs || []} />
        </div>
    );
}
