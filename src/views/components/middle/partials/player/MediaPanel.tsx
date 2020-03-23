import React from 'react';
import styled from 'styled-components';
import { FaRandom, FaUndo, FaFolderPlus } from 'react-icons/fa';

import { ISong } from '@services/db';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

import { colors } from '../../../../assets/styles/consts';
import { PreferencesBtn } from './panel.partials';
import { by } from './../../../../utils/sort';

type Props = {
    isPrefsOpen: boolean;
    loop: boolean;
    random: boolean;
    waitBetween: number;
    pointer: number;
    playlistTitle?: string;
    songs?: ISong[];
    addSongModal: () => void;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => Promise<void>;
};

export function MediaPanel({
    random,
    loop,
    playlistTitle,
    handleAction,
    songs,
    pointer,
    waitBetween,
    addSongModal,
    isPrefsOpen,
}: Props) {
    const statusClass = playlistTitle ? 'hoverable' : 'disabled';

    return (
        <ContainerDiv className="container-audio current-song-container">
            <PreferencesBtn
                handleAction={handleAction}
                statusClass={statusClass}
                initialState={isPrefsOpen}
                waitBetween={waitBetween}
            />
            <FaFolderPlus
                className={`btn action-icon ${statusClass}`}
                onClick={addSongModal}
                style={{ bottom: '5px', left: '45px' }}
            />
            <TitleText className="centered hide">{playlistTitle}</TitleText>
            <TitleText className="centered">
                {
                    songs?.sort((a, b) => by(a, b, 'song_index'))?.[pointer]
                        ?.title
                }
            </TitleText>
            <FaUndo
                className={`btn action-icon ${statusClass} ${
                    loop ? 'active' : ''
                }`}
                onClick={() => handleAction('SET_STATE', { loop: !loop })}
                style={{ bottom: '5px', right: '40px' }}
            />
            <FaRandom
                onClick={() => handleAction('SET_STATE', { random: !random })}
                className={`btn action-icon ${statusClass} ${
                    random ? 'active' : ''
                }`}
                style={{ bottom: '5px', right: '0px' }}
            />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    min-height: 42px;
`;

const TitleText = styled.h4`
    color: ${colors.lightTextColor};
    margin-left: 20px;
    margin: 12px 0;
    font-size: 1rem;
    text-align: center;
`;
