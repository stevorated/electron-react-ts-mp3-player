import React from 'react';
import { FaFastBackward, FaBackward } from 'react-icons/fa';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

type Props = {
    status: string;
    pointer: number;
    size: string;
    getPlayer: () => HTMLMediaElement | null;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function BackBtns({ handleAction, size, pointer, getPlayer }: Props) {
    return (
        <div style={{ alignItems: 'center' }}>
            <FaFastBackward
                className="btn hoverable"
                size={size}
                onClick={() => {
                    const player = getPlayer();

                    if (!player) {
                        return;
                    }

                    handleAction('BACK_SONG', pointer - 1);
                }}
            />
            <FaBackward
                className="btn hoverable"
                size={size}
                style={{ marginLeft: '10px' }}
                onClick={() => {
                    const player = getPlayer();
                    if (player) {
                        player.currentTime = player.currentTime - 5;
                    }
                }}
            />
        </div>
    );
}
