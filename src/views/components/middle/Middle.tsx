import React, { RefObject } from 'react';
import styled from 'styled-components';

import { AllHandlerActions } from '@views/interfaces';
import { TreeListType, StatusType } from '@views/interfaces';

import { PlayerContainer, SongsListContainer } from './partials';
import { colors } from '../../assets/consts';
import { AudioHandler } from './partials/songsList/audioHandler/AudioHandler';

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
    player: AudioHandler;
    panelWidth: number;
    sinewaveC: React.RefObject<HTMLCanvasElement>;
    frequencyC: React.RefObject<HTMLCanvasElement>;
    play: (dontRewind?: boolean) => void;
    pause: (stop?: boolean) => void;
    nextsong: () => Promise<void>;
    lastsong: () => Promise<void>;
    rewind: () => void;
    forward: () => void;
    setCurrentTime: (time: number) => void;
    getCurrentTime: () => number;
    addSongModal: () => void;
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
};

export function Middle({
    panelWidth,
    isPrefsOpen,
    player,
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
    sinewaveC,
    frequencyC,
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
                panelWidth={panelWidth}
                sinewaveC={sinewaveC}
                frequencyC={frequencyC}
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
