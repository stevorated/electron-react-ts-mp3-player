import React, { RefObject } from 'react';
import styled from 'styled-components';

import { HandlerAction, TreeListType } from '@views/interfaces';
import { StateHandlerAction } from '@views/interfaces';

import { PlayerContainer, SongsListContainer, Analyser } from './partials';
import { colors } from './../../assets/styles/consts';

type Props = {
    isPrefsOpen: boolean;
    loop: boolean;
    random: boolean;
    loading: boolean;
    flex: number;
    status: string;
    pointer: number;
    waitBetween: number;
    current?: TreeListType;
    mainRef: RefObject<HTMLDivElement>;
    handleAnalyse: () => void;
    getPlayer: () => HTMLMediaElement | null;
    play: (dontRewind?: boolean) => Promise<void>;
    pause: (stop?: boolean) => void;
    nextsong: () => void;
    lastsong: () => void;
    rewind: () => void;
    forward: () => void;
    setCurrentTime: (time: number) => void;
    getCurrentTime: () => number;
    addSongModal: () => void;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => Promise<void>;
};

export function Middle({
    isPrefsOpen,
    getPlayer,
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
    handleAnalyse,
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
                getPlayer={getPlayer}
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
            <Analyser handleAnalyse={handleAnalyse} getPlayer={getPlayer} />
            <SongsListContainer
                getPlayer={getPlayer}
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
