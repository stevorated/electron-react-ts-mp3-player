import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';

import { ISong } from '@services/db';
import { AllHandlerActions, TreeListType, StatusType } from '@views/interfaces';

import { Analyser } from './audioHandler';
import { PlaylistDetailsBar } from './PlaylistDetailsBar';
import { SongsContainer } from './songs';
import { Hr } from '../../../shared';

type Props = {
    panelWidth: number;
    pointer: number;
    loading: boolean;
    current?: TreeListType;
    status: StatusType;
    sinewaveC: React.RefObject<HTMLCanvasElement>;
    frequencyC: React.RefObject<HTMLCanvasElement>;
    handleAction: (action: AllHandlerActions, payload: any) => Promise<void>;
};

export function SongsListContainer({
    panelWidth,
    current,
    pointer,
    handleAction,
    status,
    loading,
    sinewaveC,
    frequencyC,
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
                        panelWidth={panelWidth}
                        sinewaveC={sinewaveC}
                        frequencyC={frequencyC}
                        size={songs.length || 0}
                        title={current?.title}
                        totalDuration={totalDuration}
                    />
                    <Hr />
                    <Analyser
                        panelWidth={panelWidth}
                        sinewaveC={sinewaveC}
                        frequencyC={frequencyC}
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
