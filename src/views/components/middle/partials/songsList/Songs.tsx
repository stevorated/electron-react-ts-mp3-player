import React from 'react';
import { Song } from './Song';
import { SongType } from '../../../../interfaces';
import { by } from '../../../../utils';

type Props = {
    rows: number;
    songs: SongType[];
};

export const Songs = ({ songs, rows }: Props) => {
    const renderSongs = () => {
        const arr = [];
        for (let i = 0; i < rows; i++) {
            arr.push(i);
        }

        return songs
            .sort((a, b) => by<SongType>(a, b, 'song_index'))
            .map(song => (
                <li key={`song ${song.song_index}`}>
                    <Song song={song} />
                </li>
            ));
    };

    return <ol className="song-list-container">{renderSongs()}</ol>;
};
