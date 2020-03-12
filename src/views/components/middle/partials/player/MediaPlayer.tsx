import React from 'react';

import { HandlerAction, StateHandlerAction } from '@views/interfaces';

type Props = {
    pointer: number;
    src: string;
    nextsong: () => void;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function MediaPlayer({ src, nextsong, handleAction }: Props) {
    return (
        <audio
            id="media-player"
            onPlayingCapture={() => {
                handleAction('SET_STATUS', 'playing');
            }}
            onPauseCapture={() => {
                handleAction('SET_STATUS', 'paused');
            }}
            onEnded={async () => {
                nextsong();
            }}
            className="audio"
            // controls 
            src={src}
        >
            <source src={src} type="audio/mp3" />
        </audio>
    );
}
