import React from 'react';
import styled, { keyframes } from 'styled-components';
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
        <ContainerDiv>
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
            {loading && <Spinner size="200px" />}
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    overflow: auto;
    height: auto;
    padding: 0 10px;
`;

const spin = keyframes`
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(360deg);
}

`;

const Spinner = styled(FaSpinner)`
    color: rgba(245, 245, 245, 0.6);
    position: absolute;
    z-index: 100000000;
    top: 50%;
    left: 50%;

    animation-name: ${spin};
    animation-duration: 1500ms;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(1, 0, 0, 1);
`;
