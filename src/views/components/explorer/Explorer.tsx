import React, { DragEvent, MouseEvent, RefObject } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import styled from 'styled-components';

import {
    HandlerAction,
    TreeListType,
    StateHandlerAction,
} from '@views/interfaces';

import { ExplorerBtn } from './partials';
import { Playlists } from './partials';
import { Dropzone, Hr } from '../shared';

import './Explorer.style.less';

type Props = {
    panelRef: RefObject<HTMLElement>;
    currentPlaylistId: number;
    tree: TreeListType[];
    onMouseOver: (e: DragEvent<HTMLElement>) => void;
    onMouseDown: (e: MouseEvent<HTMLElement>) => void;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function Explorer({
    currentPlaylistId,
    tree,
    handleAction,
    onMouseOver,
    onMouseDown,
    panelRef,
}: Props) {
    return (
        <aside
            ref={panelRef}
            className="flexbox-item-grow sidebar"
            onMouseEnter={onMouseOver}
            onMouseOver={onMouseOver}
            onMouseDown={onMouseDown}
            onDrag={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()}
            onDragEnd={e => e.preventDefault()}
        >
            <Dropzone height="5vh" hide />
            <ExplorerBtn
                icon={<StylePlayIcon />}
                text="new playlist…"
                onClick={() => {
                    handleAction('CREATE_PLAYLIST_TEMP');
                }}
            />
            <Hr />
            <Playlists
                currentPlaylistId={currentPlaylistId}
                tree={tree}
                handleAction={handleAction}
            />
        </aside>
    );
}

const StylePlayIcon = styled(FaPlusCircle)`
    font-size: 12px;
    margin-right: 5px;
    padding: 0px 5px;
    border-radius: 100%;
`;
