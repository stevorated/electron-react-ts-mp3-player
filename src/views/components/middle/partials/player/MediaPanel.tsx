import React from 'react';
import { FaCogs, FaPoo, FaRandom, FaUndo } from 'react-icons/fa';

import { ISong } from '../../../../../services/db';
import { HandlerAction } from '../../../../interfaces';

type Props = {
    albumTitle: string;
    songs?: ISong[];
    handleAction: (action: HandlerAction, payload?: any) => void;
};

export function MediaPanel({ albumTitle, handleAction }: Props) {
    const openSettings = () => {
        handleAction(
            'openCreatePlaylistModal',
            'BLA BLA BLA BLA BLA BLA BLA BLA BLA'
        );
    };
    return (
        <div className="container-audio current-song-container">
            <FaCogs
                className="action-icon hoverable"
                onClick={openSettings}
                style={{ bottom: '5px', left: '5px' }}
            />
            <FaPoo
                className="action-icon hoverable"
                style={{ bottom: '5px', left: '45px' }}
            />
            <h3 className="nopadd centered">{albumTitle}</h3>
            <h3 className="nopadd centered">Song Title</h3>
            <h3 className="nopadd centered">02:42</h3>
            <FaUndo
                className="action-icon hoverable"
                style={{ bottom: '5px', right: '40px' }}
            />
            <FaRandom
                className="action-icon hoverable"
                style={{ bottom: '5px', right: '0px' }}
            />
        </div>
    );
}
