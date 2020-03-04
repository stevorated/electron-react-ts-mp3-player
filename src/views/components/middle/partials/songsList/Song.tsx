import React, { FunctionComponent } from 'react';
import { SongType } from '../../../../interfaces';
import { formatMillsToTime } from './../../../../utils';

type Props = {
    song: SongType;
};

export const Song: FunctionComponent<Props> = ({ song }: Props) => {
    const { id, title, length, song_index } = song;
    return (
        <div className="song-container">
            <h3>{song_index}</h3>
            <h3>{title}</h3>
            <h3>{formatMillsToTime(300000)}</h3>
        </div>
    );
};
