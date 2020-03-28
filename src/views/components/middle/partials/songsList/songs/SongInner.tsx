import React, { RefObject } from 'react';
import styled from 'styled-components';

import { AllHandlerActions } from '@views/interfaces';
import { ISong } from '@services/db/interfaces';

import { formatMillsToTime } from '../../../../../utils';
import { colors } from '../../../../../assets/consts';

type Props = {
    isEditable: boolean;
    float: boolean;
    active: boolean;
    childId: string;
    newTitle: string;
    title: string;
    index: number;
    length: number;
    song: ISong;
    inputRef: RefObject<HTMLInputElement>;
    setNewTitle: (title: string) => void;
    setIsEditable: (editable: boolean) => void;
    handleSave: () => void;
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
};

export function SongInner({
    index,
    isEditable,
    float,
    active,
    childId,
    newTitle,
    title,
    length,
    song,
    inputRef,
    setNewTitle,
    setIsEditable,
    handleSave,
    handleAction,
}: Props) {
    return !isEditable ? (
        <div
            className={float ? 'float-text-wrapper' : ''}
            onClick={() =>
                handleAction('CHANGE_SONG', {
                    pointer: index - 1,
                    click: true,
                })
            }
        >
            <h3
                id={childId}
                className={`hoverable ${float ? 'float-text' : ''} ${
                    active ? 'active' : ''
                }`}
            >
                {title} <TinyText>{formatMillsToTime(length || 0)}</TinyText>
            </h3>
        </div>
    ) : (
        <div
            className={float ? 'float-text-wrapper' : ''}
            onClick={() =>
                !isEditable &&
                handleAction('CHANGE_SONG', (song.song_index ?? 0) - 1)
            }
        >
            <div>
                <input
                    ref={inputRef}
                    value={newTitle || title}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => {
                        if (e.keyCode === 13) {
                            setIsEditable(false);
                            handleSave();
                        }
                    }}
                    onBlur={handleSave}
                    type="text"
                    style={{ margin: '10px' }}
                    className="song-title-input"
                />
            </div>
        </div>
    );
}

const TinyText = styled.span`
    color: ${colors.mediumTextColor};
    margin-left: 20px;
    margin-right: 10px;
    font-size: 11px;
`;
