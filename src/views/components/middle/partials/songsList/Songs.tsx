import React from 'react';
import { Song } from './Song';
import { ISong } from '../../../../../services/db';
import { by } from '../../../../utils';
import { HandlerAction } from '../../../../interfaces';

type Props = {
    rows: number;
    songs: ISong[];
    pointer: number;
    handleAction: (action: HandlerAction, payload?: any) => void;
    status: string;
};

export function Songs({ songs, rows, pointer, handleAction, status }: Props) {
    const renderSongs = () => {
        const arr = [];
        for (let i = 0; i < rows; i++) {
            arr.push(i);
        }

        return songs
            .sort((a, b) => by<ISong>(a, b, 'song_index'))
            .map(song => (
                <li
                    key={`song ${song.song_index}`}
                    className={song.song_index === pointer + 1 ? 'active' : ''}
                    onClick={() =>
                        handleAction('changeSong', (song.song_index ?? 0) - 1)
                    }
                >
                    <Song
                        status={status}
                        song={song}
                        active={song.song_index === pointer + 1}
                    />
                </li>
            ));
    };

    return <ol className="song-list-container">{renderSongs()}</ol>;
}
