import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaEdit, FaListUl, FaPoo } from 'react-icons/fa';

import { ISong } from '@services/db';
import { AllHandlerActions, StatusType } from '@views/interfaces';

import { colors } from '../../../../../assets/styles/consts';
import { shouldFloat } from '../../../../../utils';
import { SongPlayBtn } from './SongPlayBtn';
import { SongInner } from './SongInner';

type Props = {
    active: boolean;
    status: StatusType;
    playlistId: number;
    index: number;
    song: ISong;
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
};

export function Song({
    index,
    song,
    active,
    status,
    handleAction,
    playlistId,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditable, setIsEditable] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const { title, length } = song;
    const smallIconSize = '.9rem';
    const midIconSize = '1.1rem';
    const bigIconSize = '1.7rem';
    const iconClassName = 'song-play-button';
    const childId = `float-text-${title}-${song.id}`;
    const parentId = `float-text-wrapper-${title}-${song.id}`;
    const float = shouldFloat({ childId, parentId, ratio: 13, title });

    const handleSetNewTitle = (newTitle: string) => {
        newTitle.length < 50 ? setNewTitle(newTitle) : undefined;
    };

    const handleSave = () => {
        setIsEditable(false);
        newTitle !== '' &&
            newTitle !== title &&
            handleAction('UPDATE_SONG', {
                ...song,
                title: newTitle,
            });
    };

    return (
        <ContainerDiv first={song.song_index === 1} id={parentId}>
            <TitleDiv
                onClick={() => {
                    handleAction('CHANGE_SONG', {
                        pointer: index - 1,
                        click: true,
                    });
                }}
            >
                <TinyText>{index}</TinyText>
                <SongPlayBtn
                    status={status}
                    active={active}
                    iconClassName={iconClassName}
                    size={bigIconSize}
                />
            </TitleDiv>
            <SongInner
                index={index}
                length={length}
                inputRef={inputRef}
                title={title}
                newTitle={newTitle}
                setNewTitle={handleSetNewTitle}
                setIsEditable={setIsEditable}
                childId={childId}
                active={active}
                float={float}
                song={song}
                isEditable={isEditable}
                handleAction={handleAction}
                handleSave={handleSave}
            />
            <ActionContainer>
                <FaListUl
                    size={midIconSize}
                    className={`${iconClassName} hoverable`}
                />
                <FaEdit
                    size={midIconSize}
                    className={`${iconClassName} hoverable`}
                    onClick={() => {
                        setIsEditable(true);
                        setTimeout(() => {
                            inputRef.current?.focus();
                        }, 50);
                    }}
                />
                <FaPoo
                    onClick={() => {
                        handleAction('DELETE_SONG', [song, playlistId]);
                    }}
                    size={smallIconSize}
                    className={`${iconClassName} danger hoverable`}
                />
            </ActionContainer>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: 'center';
    border-bottom: rgba(245, 222, 179, 0.05) solid 2px;
    border-top: ${({ first }: { first: boolean }) =>
        first && `rgba(245, 222, 179, 0.05) solid 2px`};
`;

const TitleDiv = styled.div`
    display: flex;
    align-items: center;
`;

const ActionContainer = styled.div`
    display: flex;
    alignitems: center;
`;

const TinyText = styled.span`
    color: ${colors.mediumTextColor};
    align-self: center;
    margin-left: 20px;
    margin-right: 10px;
    font-size: 11px;
`;
