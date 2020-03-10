import React, { useState } from 'react';
import {
    FaPlayCircle,
    FaPauseCircle,
    FaEdit,
    FaListUl,
    FaPoo,
} from 'react-icons/fa';

import { ISong } from '@services/db';
import { shouldFloat, formatMillsToTime } from '../../../../utils';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

type Props = {
    song: ISong;
    active: boolean;
    status: string;
    playlistId?: number;
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
    const [isEditable, setIsEditable] = useState(false);
    const { title, length, song_index: songIndex } = song;
    const smallIconSize = '.9rem';
    const midIconSize = '1.4rem';
    const bigIconSize = '1.7rem';
    const iconClassName = 'song-play-button';
    const childId = `float-text-${title}-${song.id}`;
    const parentId = `float-text-wrapper-${title}-${song.id}`;
    const float = shouldFloat({ childId, parentId, ratio: 13, title });

    return (
        <div className="dropable">
            <div
                id={parentId}
                draggable
                onDragOver={e => {
                    e.preventDefault();
                }}
                className="song-container border-bottom-light"
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        // backgroundColor: 'red',
                        // padding: '30px',
                    }}
                    onClick={() =>
                        handleAction('CHANGE_SONG', (song.song_index ?? 0) - 1)
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
                            handleAction(
                                'CHANGE_SONG',
                                (song.song_index ?? 0) - 1
                            )
                        }
                    >
                        <h3 id={childId} className={float ? 'float-text' : ''}>
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
                            handleAction(
                                'CHANGE_SONG',
                                (song.song_index ?? 0) - 1
                            )
                        }
                    >
                        <input type="text" className="song-title-input" />
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
