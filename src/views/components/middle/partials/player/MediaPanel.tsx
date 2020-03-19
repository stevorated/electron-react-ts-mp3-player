import React from 'react';
import styled from 'styled-components';
import { FaCogs, FaRandom, FaUndo, FaFolderPlus } from 'react-icons/fa';

import { ISong } from '@services/db';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

import { colors } from '../../../../assets/styles/consts';
// import { HandlerAction } from '@views/interfaces';

type Props = {
    loop: boolean;
    random: boolean;
    pointer: number;
    playlistTitle?: string;
    songs?: ISong[];
    addSongModal: () => void;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function MediaPanel({
    random,
    loop,
    playlistTitle,
    handleAction,
    songs,
    pointer,
    addSongModal,
}: Props) {
    // const addSongModal = () => {
    //     handleAction('ADD_SONG_MODAL');
    // };
    const statusClass = playlistTitle ? 'hoverable' : 'disabled';

    return (
        <ContainerDiv className="container-audio current-song-container">
            <FaCogs
                className={`btn action-icon ${statusClass}`}
                style={{ bottom: '5px', left: '5px' }}
            />
            <FaFolderPlus
                className={`btn action-icon ${statusClass}`}
                onClick={addSongModal}
                style={{ bottom: '5px', left: '45px' }}
            />
            <TitleText className="centered hide">{playlistTitle}</TitleText>
            <TitleText className="centered">
                {songs?.[pointer]?.title}
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
`;

const TitleText = styled.h4`
    /* margin: 0 5px; */
    /* font-size: 13px; */

    color: ${colors.lightTextColor};
    margin-left: 20px;
    padding: 0;
    margin: 12px 0;
    font-size: 1rem;
    text-align: center;
`;
