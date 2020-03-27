import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';

import { ISong } from '@services/db';
import { AllHandlerActions, TreeListType, StatusType } from '@views/interfaces';

import { PlaylistDetailsBar } from './PlaylistDetailsBar';
import { SongsContainer } from './songs';
import { Hr } from '../../../shared';

type Props = {
    loading: boolean;
    current?: TreeListType;
    pointer: number;
    context: AudioContext | null;
    source: MediaElementAudioSourceNode | null;
    handleAction: (action: AllHandlerActions, payload: any) => Promise<void>;
    status: StatusType;
};

export function SongsListContainer({
    context,
    source,
    current,
    pointer,
    handleAction,
    status,
    loading,
}: Props) {
    const { nested } = current || { nested: [] };
    const songs = nested as ISong[];
    const songsDurations = songs.map(({ length }) => length);
    const totalDuration = songs.length
        ? songsDurations?.reduce((prev, current) => {
              return prev + current;
          })
        : 0;

    return (
        <ContainerDiv>
            {current && (
                <>
                    <PlaylistDetailsBar
                        source={source}
                        context={context}
                        size={songs.length || 0}
                        title={current?.title}
                        totalDuration={totalDuration}
                    />
                    <Hr />
                    <SongsContainer
                        playlistId={current?.id || -1}
                        songs={songs}
                        pointer={pointer}
                        status={status}
                        handleAction={handleAction}
                        loading={loading}
                    />
                </>
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
