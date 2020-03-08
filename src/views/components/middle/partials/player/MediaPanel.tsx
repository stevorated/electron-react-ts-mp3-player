import React from 'react';
import { FaCogs, FaPoo, FaRandom, FaUndo } from 'react-icons/fa';

import { ISong } from '@services/db';
import { HandlerAction } from '@views/interfaces';

type Props = {
    pointer: number;
    playlistTitle?: string;
    songs?: ISong[];
    handleAction: (action: HandlerAction, payload?: any) => void;
};

export function MediaPanel({
    playlistTitle,
    handleAction,
    songs,
    pointer,
}: Props) {
    const openSettings = () => {
        handleAction('HANDLE_OPEN_MODAL');
    };
    const statusClass = playlistTitle ? 'hoverable' : 'disabled';
    return (
        <div className="container-audio current-song-container">
            <FaCogs
                className={`action-icon ${statusClass}`}
                onClick={openSettings}
                style={{ bottom: '5px', left: '5px' }}
            />
            <FaPoo
                className={`action-icon ${statusClass}`}
                style={{ bottom: '5px', left: '45px' }}
            />
            <h4 className="no-pad centered">{playlistTitle}</h4>
            <h4 className="no-pad centered">{songs?.[pointer]?.title}</h4>
            <FaUndo
                className={`action-icon ${statusClass}`}
                style={{ bottom: '5px', right: '40px' }}
            />
            <FaRandom
                className={`action-icon ${statusClass}`}
                style={{ bottom: '5px', right: '0px' }}
            />
        </div>
    );
}
