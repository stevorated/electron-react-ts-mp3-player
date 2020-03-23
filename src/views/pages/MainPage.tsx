import React, { useState, MouseEvent, useRef } from 'react';

import { Explorer, Middle, Info, Status } from '../components';
import { TreeListType } from '../interfaces';
import { HandlerAction, StateHandlerAction } from '../interfaces';

type Props = {
    pointer: number;
    currentPlaylistId: number;
    waitBetween: number;
    status: string;
    showExplorer: boolean;
    isPrefsOpen: boolean;
    loading: boolean;
    loop: boolean;
    random: boolean;
    tree: TreeListType[];
    current: TreeListType;
    getPlayer: () => HTMLMediaElement | null;
    play: (dontRewind?: boolean) => Promise<void>;
    pause: (stop?: boolean) => void;
    nextsong: () => void;
    lastsong: () => void;
    rewind: () => void;
    forward: () => void;
    getCurrentTime: () => number;
    setCurrentTime: (time: number) => void;
    addSongModal: () => void;
    handleAnalyse: () => void;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload: any
    ) => Promise<void>;
};

export function MainPage({
    isPrefsOpen,
    showExplorer,
    current,
    getPlayer,
    play,
    pause,
    nextsong,
    lastsong,
    rewind,
    forward,
    getCurrentTime,
    setCurrentTime,
    addSongModal,
    handleAction,
    handleAnalyse,
    tree,
    currentPlaylistId,
    pointer,
    waitBetween,
    status,
    loading,
    loop,
    random,
}: Props) {
    const resizeClass = 'move-cursor';
    const panelRef = useRef<HTMLElement>(null);
    const layoutRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    const [flex, setFlex] = useState(4);
    const [draggin, setDraggin] = useState(false);

    const handleOnMouseOver = (e: MouseEvent) => {
        const panel = panelRef.current;
        if (!panel) {
            return;
        }
        const panelWidth = panel.clientWidth;
        const x = e.clientX;

        if (panelWidth - x < 1) {
            panel.classList.add(resizeClass);
        } else if (!draggin) {
            panel.classList.remove(resizeClass);
        }
    };

    const handleOnMouseDown = (_: MouseEvent) => {
        const panel = panelRef.current;
        const layout = layoutRef.current;

        if (!panel || !layout) {
            return;
        }

        if (panel.classList.contains(resizeClass)) {
            setDraggin(true);
        } else if (draggin) {
            panel.classList.add(resizeClass);
        }
    };

    const handleOnMouseOut = () => {
        setDraggin(false);
    };

    const handleOnMouseMove = (e: MouseEvent) => {
        if (!draggin) {
            return;
        }
        const layout = layoutRef.current;
        const panel = panelRef.current;
        if (!layout || !panel) {
            return;
        }

        const panelWidth = panel.clientWidth;
        const layoutWidth = layout.clientWidth;
        const newFlex = (layoutWidth - e.clientX) / panelWidth;

        if (newFlex < 1.2 || newFlex > 4) {
            return;
        }

        if (draggin) {
            panel.classList.add(resizeClass);
            setFlex((layoutWidth - e.clientX) / panelWidth);
        }
    };

    const handleOnMouseUp = (_: MouseEvent<HTMLElement>) => {
        const panel = panelRef.current;
        if (!panel) {
            return;
        }
        panel.classList.remove(resizeClass);
        setDraggin(false);
    };

    return (
        <>
            <div
                ref={layoutRef}
                onMouseEnter={handleOnMouseMove}
                onMouseMove={handleOnMouseMove}
                onMouseOut={handleOnMouseMove}
                onMouseUp={handleOnMouseUp}
                onMouseLeave={handleOnMouseOut}
                className="fill-area flexbox-item-grow"
            >
                <Explorer
                    hide={!showExplorer}
                    panelRef={panelRef}
                    onMouseOver={handleOnMouseOver}
                    onMouseDown={handleOnMouseDown}
                    currentPlaylistId={currentPlaylistId}
                    tree={tree}
                    handleAction={handleAction}
                />

                <Middle
                    isPrefsOpen={isPrefsOpen}
                    addSongModal={addSongModal}
                    loading={loading}
                    flex={flex}
                    mainRef={mainRef}
                    getPlayer={getPlayer}
                    play={play}
                    pause={pause}
                    nextsong={nextsong}
                    rewind={rewind}
                    forward={forward}
                    lastsong={lastsong}
                    setCurrentTime={setCurrentTime}
                    getCurrentTime={getCurrentTime}
                    current={current}
                    pointer={pointer}
                    status={status}
                    loop={loop}
                    random={random}
                    waitBetween={waitBetween}
                    handleAction={handleAction}
                    handleAnalyse={handleAnalyse}
                />
                <Info />
            </div>
            <Status status={status} pointer={pointer} current={current} />
        </>
    );
}
