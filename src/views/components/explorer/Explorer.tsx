import React, { DragEvent, MouseEvent, RefObject } from 'react';
import { FaPlusCircle, FaFolderPlus } from 'react-icons/fa';

import {
    HandlerAction,
    TreeListType,
    StateHandlerAction,
} from '@views/interfaces';

import { ExplorerBtn } from './partials';
import { Playlists } from './partials';
import { DropZone } from '../shared';

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
            <ExplorerBtn
                icon={
                    <FaPlusCircle
                        style={{
                            fontSize: '12px',
                            marginRight: '5px',
                            padding: '0px 5px',
                            borderRadius: '100%',
                        }}
                    />
                }
                text="new playlist…"
                onClick={() => {
                    handleAction('CREATE_PLAYLIST_TEMP');
                }}
            />
            <ExplorerBtn
                icon={
                    <FaFolderPlus
                        style={{
                            fontSize: '12px',
                            marginRight: '5px',
                            padding: '0px 5px',
                            borderRadius: '100%',
                        }}
                    />
                }
                text="new folder"
                onClick={() => {
                    console.log('NEW FOLDER');
                }}
            />

            <DropZone />
            <Playlists
                currentPlaylistId={currentPlaylistId}
                tree={tree}
                handleAction={handleAction}
            />
        </aside>
    );
}

// <Modal
//                 modalLabel="somthing_else_modal"
//                 buttonText="somthing else…"
//                 modalTitle="Ya Alla"
//                 buttonIcon={
//                     <FaPoo
//                         style={{
//                             fontSize: '12px',
//                             marginRight: '5px',
//                             padding: '0px 5px',
//                             borderRadius: '100%',
//                         }}
//                     />
//                 }
//             >
//                 <h1>DO SOMETHING FORM</h1>
//             </Modal>
