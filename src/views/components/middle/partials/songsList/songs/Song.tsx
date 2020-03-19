import React, { useState, useRef } from 'react';
import {
    FaPlayCircle,
    FaPauseCircle,
    FaEdit,
    FaListUl,
    FaPoo,
} from 'react-icons/fa';

import { ISong } from '@services/db';
import { shouldFloat, formatMillsToTime } from '../../../../../utils';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

type Props = {
    song: ISong;
    active: boolean;
    status: string;
    playlistId: number;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function Song({
    song,
    active,
    status,
    handleAction,
    playlistId,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditable, setIsEditable] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const { title, length, song_index: songIndex } = song;
    const smallIconSize = '.9rem';
    const midIconSize = '1.1rem';
    const bigIconSize = '1.7rem';
    const iconClassName = 'song-play-button';
    const childId = `float-text-${title}-${song.id}`;
    const parentId = `float-text-wrapper-${title}-${song.id}`;
    const float = shouldFloat({ childId, parentId, ratio: 13, title });

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
        <div>
            <div
                id={parentId}
                onDragOver={e => {
                    e.preventDefault();
                }}
                className={`song-container border-bottom-light ${
                    song.song_index === 1 ? 'border-top-light' : ''
                }`}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    onClick={() =>
                        handleAction('CHANGE_SONG', {
                            pointer: (song.song_index ?? 0) - 1,
                            click: true,
                        })
                    }
                >
                    <span className="tiny-text" style={{ marginRight: '10px' }}>
                        {songIndex}
                    </span>
                    {status === 'playing' && active ? (
                        <FaPauseCircle
                            size={bigIconSize}
                            className={`${iconClassName} hoverable round`}
                        />
                    ) : (
                        <FaPlayCircle
                            size={bigIconSize}
                            className={`${iconClassName} hoverable round`}
                        />
                    )}
                </div>
                {!isEditable ? (
                    <div
                        className={float ? 'float-text-wrapper' : ''}
                        onClick={() =>
                            handleAction('CHANGE_SONG', {
                                pointer: (song.song_index ?? 0) - 1,
                                click: true,
                            })
                        }
                    >
                        <h3
                            id={childId}
                            className={`hoverable ${
                                float ? 'float-text' : ''
                            } ${active ? 'active' : ''}`}
                        >
                            {title}{' '}
                            <span className="tiny-text">
                                {formatMillsToTime(length || 0)}
                            </span>
                        </h3>
                    </div>
                ) : (
                    <div
                        className={float ? 'float-text-wrapper' : ''}
                        onClick={() =>
                            !isEditable &&
                            handleAction(
                                'CHANGE_SONG',
                                (song.song_index ?? 0) - 1
                            )
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
                )}
                <div style={{ display: 'flex' }}>
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
                </div>
            </div>
        </div>
    );
}
