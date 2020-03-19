import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { ISong } from '@services/db';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

import { Cards } from './Songs';
import { DropZone } from '../../../../shared';

type Props = {
    loading: boolean;
    songs: ISong[];
    pointer: number;
    status: string;
    playlistId: number;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function CardsContainer({
    songs,
    pointer,
    status,
    playlistId,
    handleAction,
    loading,
}: Props) {
    return (
        <div>
            {songs.length ? (
                <DndProvider backend={Backend}>
                    <Cards
                        songs={songs}
                        pointer={pointer}
                        status={status}
                        playlistId={playlistId}
                        handleAction={handleAction}
                    />
                </DndProvider>
            ) : !loading ? (
                <div>
                    <DropZone height="50vh" />
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
