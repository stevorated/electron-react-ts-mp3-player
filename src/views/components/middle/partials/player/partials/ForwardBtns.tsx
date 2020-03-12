import React from 'react';
import { FaForward, FaFastForward } from 'react-icons/fa';
import { HandlerAction, StateHandlerAction } from '@views/interfaces';

type Props = {
    pointer: number;
    size: string;
    getPlayer: () => HTMLMediaElement | null;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function ForwardBtns({ size, getPlayer, handleAction, pointer }: Props) {
    return (
        <div>
            <FaForward
                className="btn hoverable"
                size={size}
                style={{ marginRight: '10px' }}
                onClick={() => {
                    const player = getPlayer();
                    if (player) {
                        player.currentTime = player.currentTime + 5;
                    }
                }}
            />
            <FaFastForward
                className="btn hoverable"
                size={size}
                onClick={() => handleAction('NEXT_SONG', pointer + 1)}
            />
        </div>
    );
}
