import React, { RefObject } from 'react';
import styled from 'styled-components';

import { AllHandlerActions } from '@views/interfaces';
import { TreeListType, StatusType } from '@views/interfaces';

import { PlayerContainer, SongsListContainer } from './partials';
import { colors } from './../../assets/styles/consts';

type Props = {
    isPrefsOpen: boolean;
    loop: boolean;
    random: boolean;
    loading: boolean;
    flex: number;
    pointer: number;
    waitBetween: number;
    status: StatusType;
    current?: TreeListType;
    mainRef: RefObject<HTMLDivElement>;
    context: AudioContext | null;
    source: MediaElementAudioSourceNode | null;
    player: HTMLMediaElement | null;
    play: (dontRewind?: boolean) => Promise<void>;
    pause: (stop?: boolean) => void;
    nextsong: () => void;
    lastsong: () => void;
    rewind: () => void;
    forward: () => void;
    setCurrentTime: (time: number) => void;
    getCurrentTime: () => number;
    addSongModal: () => void;
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
};

export function Middle({
    isPrefsOpen,
    player,
    context,
    source,
    play,
    pause,
    nextsong,
    lastsong,
    rewind,
    forward,
    setCurrentTime,
    getCurrentTime,
    addSongModal,
    current,
    pointer,
    waitBetween,
    handleAction,
    status,
    mainRef,
    flex,
    loading,
    loop,
    random,
}: Props) {
    return (
        <ContainerDiv ref={mainRef} style={{ flex }}>
            <PlayerContainer
                isPrefsOpen={isPrefsOpen}
                handleAction={handleAction}
                player={player}
                play={play}
                pause={pause}
                nextsong={nextsong}
                lastsong={lastsong}
                rewind={rewind}
                forward={forward}
                setCurrentTime={setCurrentTime}
                getCurrentTime={getCurrentTime}
                addSongModal={addSongModal}
                status={status}
                loop={loop}
                random={random}
                current={current}
                pointer={pointer}
                waitBetween={waitBetween}
            />
            <SongsListContainer
                context={context}
                source={source}
                loading={loading}
                status={status}
                handleAction={handleAction}
                current={current}
                pointer={pointer}
            />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    overflow: auto;
    height: auto;
    flex: 4;
    display: flex;
    flex-direction: column;
    background-color: ${colors.darkPrimaryColor};
    color: #d4d4d4;
`;
