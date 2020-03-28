import React, { FunctionComponent } from 'react';
import { SongType } from 'src/views/constants/mocks';
import dayjs from 'dayjs';

type Props = {
  song: SongType;
};

export const Song: FunctionComponent<Props> = ({ song }: Props) => {
  const { id, title, length, song_index } = song;
  return (
    <div className="song-container">
      <h3>{song_index}</h3>
      <h3>{title}</h3>
      <h3>{dayjs(212310).format('mm:ss')}</h3>
    </div>
  );
};
