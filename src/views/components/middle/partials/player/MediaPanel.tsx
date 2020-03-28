import React from 'react';
import styled from 'styled-components';
import { FaRandom, FaUndo, FaFolderPlus } from 'react-icons/fa';

import { ISong } from '@services/db';
import { AllHandlerActions } from '@views/interfaces';

import { colors } from '../../../../assets/consts';
import { by } from '../../../../utils';
import { PreferencesBtn } from './panel.partials';

type Props = {
    isPrefsOpen: boolean;
    loop: boolean;
    random: boolean;
    waitBetween: number;
    pointer: number;
    playlistTitle?: string;
    songs?: ISong[];
    addSongModal: () => void;
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
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
    const title = songs?.sort((a, b) => by(a, b, 'song_index'))?.[pointer]
        ?.title;
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
            <TitleText className="centered">{title}</TitleText>
            <FaUndo
                className={`btn action-icon ${statusClass} ${
                    loop ? 'active' : ''
                }`}
                onClick={() =>
                    handleAction('UPDATE_REMOTE_STATE', { loop: !loop })
                }
                style={{ bottom: '5px', right: '40px' }}
            />
            <FaRandom
                onClick={() =>
                    handleAction('UPDATE_REMOTE_STATE', { random: !random })
                }
                className={`btn action-icon ${statusClass} ${
                    random ? 'active' : ''
                }`}
                style={{ bottom: '5px', right: '0px' }}
            />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    width: 97%;
    min-height: fit-content;
    border-radius: 5px;
    color: #d4d4d4;
    margin: 0px auto;
    padding-bottom: 0;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    min-height: 42px;

    .active {
        color: ${colors.activeTextColor};
        background-color: rgba(180, 40, 40, 0.6);
        font-weight: 700;
    }
`;

const TitleText = styled.h4`
    color: ${colors.lightTextColor};
    margin-left: 20px;
    margin: 12px 0;
    font-size: 1rem;
    text-align: center;
`;
