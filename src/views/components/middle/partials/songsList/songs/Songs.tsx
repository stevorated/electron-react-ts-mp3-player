import React, { useState, useCallback, useEffect } from 'react';
import update from 'immutability-helper';
import { ISong } from '@services/db';

import { SongContainer } from './SongContainer';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';
import { by } from '../../../../../utils/sort';

const style = {};

export interface Item {
    id: number;
    text: string;
}

export interface ContainerState {
    songs: Item[];
}

type Props = {
    songs: ISong[];
    pointer: number;
    status: string;
    playlistId: number;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => Promise<void>;
};

export function Songs({
    songs: currentState,
    pointer,
    status,
    playlistId,
    handleAction,
}: Props) {
    const [busy, setBusy] = useState(false);
    const [songs, setSongs] = useState(
        currentState?.sort((a, b) => by<ISong>(a, b, 'song_index'))
    );
    useEffect(() => {
        setSongs(currentState?.sort((a, b) => by<ISong>(a, b, 'song_index')));
    }, [currentState]);

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const dragCard = songs[dragIndex];
            setSongs(
                update(songs, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragCard],
                    ],
                })
            );
        },
        [songs]
    );

    const handleSortSongs = async (songId: number, newIndex: number) => {
        if (busy) {
            return;
        }

        setBusy(true);
        await handleAction('SORT_PLAYLIST', {
            songs: songs.map((song, index) => ({
                ...song,
                song_index: index + 1,
            })),
            songId,
            newIndex,
        });

        setTimeout(() => {
            setBusy(false);
        }, 1000);
    };

    const renderCard = (song: ISong, index: number) => {
        return (
            <SongContainer
                key={song.id}
                index={index}
                id={song.id}
                moveCard={moveCard}
                handleSortSongs={handleSortSongs}
                song={song}
                pointer={pointer}
                maxPointer={
                    currentState.length - 1 > 0 ? currentState.length - 1 : 1
                }
                status={status}
                playlistId={playlistId}
                handleAction={handleAction}
            />
        );
    };

    return (
        <div style={style}>{songs.map((song, i) => renderCard(song, i))}</div>
    );
}
