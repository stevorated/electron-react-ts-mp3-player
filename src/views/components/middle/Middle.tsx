import React, { RefObject } from 'react';

import { HandlerAction, TreeListType } from '@views/interfaces';
import { StateHandlerAction } from '@views/interfaces';

import { PlayerContainer, SongsListContainer } from './partials';

type Props = {
    loading: boolean;
    flex: number;
    status: string;
    pointer: number;
    waitBetween: number;
    current?: TreeListType;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
    getPlayer: () => HTMLMediaElement | null;
    play: () => void;
    mainRef: RefObject<HTMLDivElement>;
};

export function Middle({
    getPlayer,
    current,
    pointer,
    waitBetween,
    handleAction,
    play,
    status,
    mainRef,
    flex,
    loading,
}: Props) {
    return (
        <div ref={mainRef} className="flexbox-item-grow main" style={{ flex }}>
            <PlayerContainer
                getPlayer={getPlayer}
                status={status}
                current={current}
                pointer={pointer}
                play={play}
                handleAction={handleAction}
                waitBetween={waitBetween}
            />
            <SongsListContainer
                getPlayer={getPlayer}
                loading={loading}
                status={status}
                handleAction={handleAction}
                current={current}
                pointer={pointer}
            />
        </div>
    );
}
