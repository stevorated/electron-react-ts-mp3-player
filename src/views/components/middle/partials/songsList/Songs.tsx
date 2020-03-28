import React from 'react';
import { Song } from './Song';
import { SongType } from '../../../../constants/mocks';

type Props = {
  rows: number;
  songs: SongType[];
};

export const Songs = ({ songs, rows }: Props) => {
  const renderSongs = () => {
    const arr = [];
    for (let i = 0; i < rows; i++) {
      arr.push(i);
    }

    return songs
      .sort((a, b): number => {
        if (a.song_index > b.song_index) {
          return 1;
        } else {
          return -1;
        }
      })
      .map(song => (
        <li key={`song ${song.song_index}`}>
          <Song song={song} />
        </li>
      ));
  };

  return <ol className="">{renderSongs()}</ol>;
};
