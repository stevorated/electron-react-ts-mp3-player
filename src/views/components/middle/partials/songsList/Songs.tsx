import React from 'react';

import { ISong } from '@services/db';
import { HandlerAction } from '@views/interfaces';

import { by } from '../../../../utils';
import { Song } from './Song';
import { DropZone } from '../../../shared';

type Props = {
    pointer: number;
    status: string;
    songs?: ISong[];
    handleAction: (action: HandlerAction, payload?: any) => void;
};

export function Songs({ songs, pointer, handleAction, status }: Props) {
    const renderSongs = () => {
        return songs && songs.length > 0 ? (
            songs
                ?.sort((a, b) => by<ISong>(a, b, 'song_index'))
                .map(song => (
                    <li
                        key={`song ${song.song_index}`}
                        className={
                            song.song_index === pointer + 1 ? 'active' : ''
                        }
                        onClick={() =>
                            handleAction(
                                'SET_CURRENT',
                                (song.song_index ?? 0) - 1
                            )
                        }
                    >
                        <Song
                            status={status}
                            song={song}
                            active={song.song_index === pointer + 1}
                        />
                    </li>
                ))
        ) : (
            <DropZone height="60vh" />
        );
    };

    return <ol className="song-list-container">{renderSongs()}</ol>;
}
