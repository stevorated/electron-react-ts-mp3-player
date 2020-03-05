import React from 'react';

import {
    FaPlusCircle,
    FaWrench,
    FaMusic,
    FaCoffee,
    FaTable,
    FaExternalLinkSquareAlt,
    FaCogs,
} from 'react-icons/fa';

import './PlayerContainer.style.less';
import { IPlaylist } from '../../../../../services/db';

type Props = {
    playlists: IPlaylist[];
    currentPlaylistId: number;
};

export function PlayerContainer({ playlists, currentPlaylistId }: Props) {
    const [current] = playlists
        ? playlists?.filter(
              pl => typeof pl.id === 'number' && pl.id === currentPlaylistId
          )
        : [];
    return (
        <div className="container-audio centered transition border-bottom">
            <audio
                onPlayingCapture={() => {
                    console.log('playing');
                }}
                onEnded={() => {
                    console.log('song ended');
                }}
                className="audio"
                controls
                loop
            >
                <source
                    src="C:\\Users\\garbe\\Desktop\\album\\album_1\\Actually Not Master.mp3"
                    type="audio/mp3"
                />
            </audio>
            <div className="container-audio current-song-container">
                <FaCogs
                    className="action-icon hoverable"
                    style={{ bottom: '5px', left: '5px' }}
                />
                <FaWrench
                    className="action-icon hoverable"
                    style={{ bottom: '5px', left: '45px' }}
                />
                <h3 className="nopadd centered">{current?.title}</h3>
                <h3 className="nopadd centered">Song Title</h3>
                <h3 className="nopadd centered">02:42</h3>
                <FaExternalLinkSquareAlt
                    className="action-icon hoverable"
                    style={{ bottom: '5px', right: '40px' }}
                />
                <FaPlusCircle
                    className="action-icon hoverable"
                    style={{ bottom: '5px', right: '0px' }}
                />
            </div>
        </div>
    );
}
