import React from 'react';

import { ISong } from '@services/db';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

import { by } from '../../../../utils';
import { Song } from './Song';
import { DropZone } from '../../../shared';

type Props = {
    loading: boolean;
    playlistId?: number;
    pointer: number;
    status: string;
    songs?: ISong[];
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function Songs({
    songs,
    pointer,
    handleAction,
    status,
    playlistId,
    loading,
}: Props) {
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
                    >
                        <Song
                            playlistId={playlistId}
                            handleAction={handleAction}
                            status={status}
                            song={song}
                            active={song.song_index === pointer + 1}
                        />
                    </li>
                ))
        ) : !loading ? (
            <DropZone height="50vh" />
        ) : (
            <div></div>
        );
    };

    return <ol className="song-list-container">{renderSongs()}</ol>;
}
