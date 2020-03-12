import React, { useState, MouseEvent, useRef } from 'react';

import { Explorer, Middle, Info, Status } from '../components';
import { TreeListType } from '../interfaces';
import { HandlerAction, StateHandlerAction } from '../interfaces';

type Props = {
    getPlayer: () => HTMLMediaElement;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload: any
    ) => void;
    tree: TreeListType[];
    play: () => void;
    pointer: number;
    currentPlaylistId: number;
    waitBetween: number;
    status: string;
    loading: boolean;
};

export function MainPage({
    getPlayer,
    handleAction,
    tree,
    play,
    currentPlaylistId,
    pointer,
    waitBetween,
    status,
    loading,
}: Props) {
    const [current] = tree.filter(
        item => item.type === 'playlist' && item.id === currentPlaylistId
    );

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

    const handleOnMouseMove = (e: MouseEvent) => {
        const layout = layoutRef.current;
        const panel = panelRef.current;
        if (!layout || !panel) {
            return;
        }

        const panelWidth = panel.clientWidth;
        const layoutWidth = layout.clientWidth;
        const newFlex = (layoutWidth - e.clientX) / panelWidth;

        if (newFlex < 1.3 || newFlex > 6.5) {
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
                className="fill-area flexbox-item-grow"
            >
                <Explorer
                    panelRef={panelRef}
                    onMouseOver={handleOnMouseOver}
                    onMouseDown={handleOnMouseDown}
                    currentPlaylistId={currentPlaylistId}
                    tree={tree}
                    handleAction={handleAction}
                />

                <Middle
                    loading={loading}
                    flex={flex}
                    mainRef={mainRef}
                    getPlayer={getPlayer}
                    play={play}
                    current={current}
                    pointer={pointer}
                    status={status}
                    waitBetween={waitBetween}
                    handleAction={handleAction}
                />
                <Info />
            </div>
            <Status status={status} pointer={pointer} />
        </>
    );
}
