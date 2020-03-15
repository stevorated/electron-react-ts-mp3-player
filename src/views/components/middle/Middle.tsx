import React, { RefObject } from 'react';

import { HandlerAction, TreeListType } from '@views/interfaces';
import { StateHandlerAction } from '@views/interfaces';

import { PlayerContainer, SongsListContainer, Analyser } from './partials';

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
    play: (dontRewind?: boolean) => Promise<void>;
    pause: (stop?: boolean) => void;
    nextsong: () => void;
    lastsong: () => void;
    rewind: () => void;
    forward: () => void;
    setCurrentTime: (time: number) => void;
    getCurrentTime: () => number;
    addSongModal: () => void;
    mainRef: RefObject<HTMLDivElement>;
};

export function Middle({
    getPlayer,
    play,
    pause,
    nextsong,
    lastsong,
    rewind,
    forward,
    setCurrentTime,
    getCurrentTime,
    addSongModal,
    current,
    pointer,
    waitBetween,
    handleAction,
    status,
    mainRef,
    flex,
    loading,
}: Props) {
    return (
        <div ref={mainRef} className="flexbox-item-grow main" style={{ flex }}>
            <PlayerContainer
                getPlayer={getPlayer}
                play={play}
                pause={pause}
                nextsong={nextsong}
                lastsong={lastsong}
                rewind={rewind}
                forward={forward}
                setCurrentTime={setCurrentTime}
                getCurrentTime={getCurrentTime}
                addSongModal={addSongModal}
                status={status}
                current={current}
                pointer={pointer}
                waitBetween={waitBetween}
            />
            <Analyser getPlayer={getPlayer} />
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
