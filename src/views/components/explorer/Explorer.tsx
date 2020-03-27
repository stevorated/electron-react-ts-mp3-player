import React, { DragEvent, MouseEvent, RefObject } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import styled from 'styled-components';

import { AllHandlerActions, TreeListType } from '@views/interfaces';

import { ExplorerBtn } from './partials';
import { Playlists } from './partials';
import { Dropzone, Hr } from '../shared';

import './Explorer.style.less';
import { sizes, colors } from '../../assets/styles/consts';

type Props = {
    hide: boolean;
    panelRef: RefObject<HTMLElement>;
    currentPlaylistId: number;
    tree: TreeListType[];
    onMouseOver: (e: DragEvent<HTMLElement>) => void;
    onMouseDown: (e: MouseEvent<HTMLElement>) => void;
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
};

export function Explorer({
    hide,
    currentPlaylistId,
    tree,
    handleAction,
    onMouseOver,
    onMouseDown,
    panelRef,
}: Props) {
    return (
        <Aside
            hide={hide}
            ref={panelRef}
            className="flexbox-item-grow"
            onMouseEnter={onMouseOver}
            onMouseOver={onMouseOver}
            onMouseDown={onMouseDown}
            onDrag={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()}
            onDragEnd={e => e.preventDefault()}
        >
            <Dropzone height="5vh" hide />
            <ExplorerBtn
                icon={<StyledPlayIcon />}
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
        </Aside>
    );
}

const StyledPlayIcon = styled(FaPlusCircle)`
    font-size: 12px;
    margin-right: 5px;
    padding: 0px 5px;
    border-radius: 100%;
`;

const Aside = styled.aside`
    display: ${(props: { hide?: boolean }) => props.hide && 'none'};
    overflow-x: hidden;
    min-width: 150px;
    border-right: 5px solid rgba(255, 255, 255, 0.05);
    width: ${sizes.explorerWidth};
    padding: 10px;
    overflow-y: auto;
    background-color: ${colors.lightPrimaryColor};
    color: ${colors.lightTextColor};
`;
