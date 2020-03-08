import React from 'react';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';

import { ISong } from '@services/db';
import { shouldFloat, formatMillsToTime } from '../../../../utils';

type Props = {
    song: ISong;
    active: boolean;
    status: string;
};

export function Song({ song, active, status }: Props) {
    const { title, length, song_index: songIndex } = song;
    const iconSize = '1.2rem';
    const iconClassName = 'song-play-button';
    const childId = `float-text-${title}-${song.id}`;
    const parentId = `float-text-wrapper-${title}-${song.id}`;

    const float = shouldFloat({ childId, parentId });

    return (
        <div className="dropable">
            <div
                id={parentId}
                draggable
                onDragOver={e => {
                    e.preventDefault();
                }}
                className="draggable-song song-container hoverable-light border-bottom-light"
            >
                <h3 style={{ display: 'flex', alignItems: 'center' }}>
                    {songIndex}
                    {active &&
                        (status !== 'playing' ? (
                            <FaPlayCircle
                                size={iconSize}
                                className={iconClassName}
                            />
                        ) : (
                            <FaPauseCircle
                                size={iconSize}
                                className={iconClassName}
                            />
                        ))}
                </h3>
                <div className={float ? 'float-text-wrapper' : ''}>
                    <h3 id={childId} className={float ? 'float-text' : ''}>
                        {title}
                    </h3>
                </div>
                <h3>{formatMillsToTime(length * 100)}</h3>
            </div>
        </div>
    );
}
