import React from 'react';
import { FaSpinner } from 'react-icons/fa';

import { HandlerAction, TreeListType } from '@views/interfaces';
import { StateHandlerAction } from '@views/interfaces';
import { ISong } from '@services/db';

import { PlaylistDetailsBar } from './PlaylistDetailsBar';
import { CardsContainer } from './songs';
import { Hr } from '../../../shared';

type Props = {
    loading: boolean;
    current?: TreeListType;
    pointer: number;
    getPlayer: () => HTMLMediaElement | null;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload: any
    ) => void;
    status: string;
};

export function SongsListContainer({
    current,
    pointer,
    handleAction,
    status,
    loading,
}: Props) {
    const { nested } = current || { nested: [] };
    const songs = nested as ISong[];
    return (
        <div className="main-body playlist-container">
            <PlaylistDetailsBar
                size={songs.length || 0}
                title={current?.title}
            />
            <Hr />
            {songs && (
                <CardsContainer
                    playlistId={current?.id || -1}
                    songs={songs}
                    pointer={pointer}
                    status={status}
                    handleAction={handleAction}
                    loading={loading}
                />
            )}
            {loading && <FaSpinner className="spinner spin" size="200px" />}
        </div>
    );
}

// <Hr width="95%" />;
// {current && <EQBars cols={Math.round((width - 300) / 41)} />}
