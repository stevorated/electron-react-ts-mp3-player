import React from 'react';
import styled from 'styled-components';

import { ISong } from '@services/db';
import { TreeListType, StatusType, AllHandlerActions } from '@views/interfaces';

import { MediaPanel } from './MediaPanel';
import { MediaPlayer } from './MediaPlayer';
import { Hr } from '../../../shared';
import { by } from '../../../../utils';

import './PlayerContainer.style.less';
import { AudioHandler } from '../songsList/audioHandler/AudioHandler';

type Props = {
    isPrefsOpen: boolean;
    status: StatusType;
    pointer: number;
    waitBetween: number;
    loop: boolean;
    random: boolean;
    current?: TreeListType;
    player: AudioHandler;
    play: (dontRewind?: boolean) => Promise<void>;
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

export function PlayerContainer({
    isPrefsOpen,
    handleAction,
    status,
    pointer,
    addSongModal,
    current,
    player,
    play,
    pause,
    nextsong,
    lastsong,
    rewind,
    forward,
    getCurrentTime,
    setCurrentTime,
    loop,
    random,
    waitBetween,
}: Props) {
    const size = 20;
    return (
        <ContainerDiv>
            <MediaPlayer
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
                song={(current?.nested as ISong[])?.slice()?.sort((a, b) => by(a, b, 'song_index'))?.[pointer]}
                status={status}
                pointer={pointer}
                size={`${size}px`}
                bigSize={`${size * 1.05}px`}
            />
            <Hr />
            <MediaPanel
                waitBetween={waitBetween}
                isPrefsOpen={isPrefsOpen}
                random={random}
                pointer={pointer}
                addSongModal={addSongModal}
                playlistTitle={current?.title}
                songs={current?.nested as ISong[]}
                loop={loop}
                handleAction={handleAction}
            />
            <Hr />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    width: 97%;
    min-height: fit-content;
    border-radius: 5px;
    color: #d4d4d4;
    margin: 0px auto;
    padding-top: 14px;
    padding-bottom: 0;
    overflow: hidden;
    text-justify: auto;
    text-align: center;
    transition: all 0.1s ease;
`;
