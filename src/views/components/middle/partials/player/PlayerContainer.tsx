import React, { FunctionComponent } from 'react';

import { faPlus, faMinus, faFolder } from '@fortawesome/free-solid-svg-icons';

import { Icon } from '../../../shared';

import './PlayerContainer.style.less';

type Props = {};

export const PlayerContainer: FunctionComponent<Props> = () => {
    return (
        <div className="container-audio centered">
            <audio
                onPlayingCapture={() => {
                    console.log('playling');
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
                <Icon
                    icon={faPlus}
                    style={{
                        bottom: '20px',
                        left: '5px',
                    }}
                />
                <h3 className="nopadd centered">Playlist Title</h3>
                <h3 className="nopadd centered">Song Title</h3>
                <h3 className="nopadd centered">02:42</h3>
                <Icon
                    icon={faFolder}
                    style={{
                        bottom: '20px',
                        right: '5px',
                    }}
                />
            </div>
        </div>
    );
};

// <FontAwesomeIcon
//     icon={faPlus}
//     style={{
//         borderRadius: '100%',
//         display: 'inline-block',
//         boxShadow: '0px 0px 2px #888',
//         padding: '0.5em 0.6em',
//     }}
// />;

// <FontAwesomeIcon
//     icon={faFolder}
//     style={{
//         borderRadius: '100%',
//         display: 'inline-block',
//         boxShadow: '0px 0px 2px #888',
//         padding: '0.5em 0.6em',
//     }}
// />;
