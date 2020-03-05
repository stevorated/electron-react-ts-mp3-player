import React from 'react';
import { SongType } from '../../../../interfaces';
import { formatMillsToTime } from './../../../../utils';

type Props = {
    song: SongType;
};

export function Song({ song }: Props) {
    const { title, length, song_index } = song;
    return (
        <div className="dropable">
            <div
                draggable
                onDragOver={e => {
                    console.log(e.dataTransfer);
                    e.preventDefault();
                    // e.dataTransfer.setData('title', 'ya habibi');
                }}
                // onDragStart={e => {
                //     console.log(e.dataTransfer);
                //     // e.dataTransfer.setData('title', 'ya alla');
                //     e.preventDefault();
                //     console.log();
                // }}
                className="draggable-song song-container hoverable-light border-bottom-light"
            >
                <h3>{song_index}</h3>
                <h3>{title}</h3>
                <h3>{formatMillsToTime(length * 100)}</h3>
            </div>
        </div>
    );
}
