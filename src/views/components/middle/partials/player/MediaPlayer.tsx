import React from 'react';

import { HandlerAction } from '../../../../interfaces';

type Props = {
    src: string;
    nextsong: () => void;
    handleAction: (action: HandlerAction, payload?: any) => void;
};

export function MediaPlayer({ src, nextsong, handleAction }: Props) {
    return (
        <audio
            id="media-player"
            onPlayingCapture={() => {
                handleAction('statusChange', 'playing');
            }}
            onPauseCapture={() => {
                handleAction('statusChange', 'paused');
            }}
            onEnded={async () => {
                nextsong();
                handleAction('statusChange', 'changing Song...');
            }}
            className="audio"
            controls
            src={src}
        >
            <source src={src} type="audio/mp3" />
        </audio>
    );
}
