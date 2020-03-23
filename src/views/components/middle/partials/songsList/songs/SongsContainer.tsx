import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { ISong } from '@services/db';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

import { Songs } from './Songs';
import { SongContainerDropZone } from './SongContainerDropZone';
import { useWindowSize } from './../../../../../hooks/window';

type Props = {
    loading: boolean;
    songs: ISong[];
    pointer: number;
    status: string;
    playlistId: number;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => Promise<void>;
};

export function SongsContainer({
    songs,
    pointer,
    status,
    playlistId,
    handleAction,
    loading,
}: Props) {
    useWindowSize();
    const dropHeight = songs.length < 8 ? 50 - songs?.length * 5.5 : 10;

    const handleDrop = (files: File[]) => {
        if (files.length === 0) {
            return;
        }

        handleAction(
            'ADD_SONG_DROP',
            files.map(file => file.path)
        );
    };
    return (
        <>
            {songs.length ? (
                <DndProvider backend={Backend}>
                    <div style={{ position: 'relative' }}>
                        <Songs
                            songs={songs}
                            pointer={pointer}
                            status={status}
                            playlistId={playlistId}
                            handleAction={handleAction}
                        />
                        <SongContainerDropZone
                            handleDrop={handleDrop}
                            height={`${dropHeight}vh`}
                        />
                    </div>
                </DndProvider>
            ) : !loading ? (
                <SongContainerDropZone handleDrop={handleDrop} height="51vh" />
            ) : (
                // <div></div>
                <div></div>
            )}
        </>
    );
}
