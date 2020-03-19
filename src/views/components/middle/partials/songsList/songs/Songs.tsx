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
    ) => void;
};

export function Cards({
    songs: currentState,
    pointer,
    status,
    playlistId,
    handleAction,
}: Props) {
    const [songs, setSongs] = useState(currentState);
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

    const renderCard = (song: ISong, index: number) => {
        return (
            <SongContainer
                key={song.id}
                index={index}
                id={song.id}
                moveCard={moveCard}
                song={song}
                pointer={pointer}
                status={status}
                playlistId={playlistId}
                handleAction={handleAction}
            />
        );
    };

    return (
        <>
            <div style={style}>
                {songs.map((song, i) => renderCard(song, i))}
            </div>
        </>
    );
}
