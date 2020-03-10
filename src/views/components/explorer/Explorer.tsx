import React from 'react';
import { FaPlusCircle, FaPoo, FaFolderPlus } from 'react-icons/fa';

import {
    HandlerAction,
    TreeListType,
    StateHandlerAction,
} from '@views/interfaces';

import { ExplorerBtn } from './partials';
import { Playlists } from './partials';
import { Modal, DropZone } from '../shared';

import './Explorer.style.less';

type Props = {
    currentPlaylistId: number;
    tree: TreeListType[];
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export function Explorer(props: Props) {
    return (
        <aside className="flexbox-item-grow sidebar">
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
                    props.handleAction('CREATE_PLAYLIST_TEMP');
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
            <Modal
                modalLabel="somthing_else_modal"
                buttonText="somthing else…"
                modalTitle="Ya Alla"
                buttonIcon={
                    <FaPoo
                        style={{
                            fontSize: '12px',
                            marginRight: '5px',
                            padding: '0px 5px',
                            borderRadius: '100%',
                        }}
                    />
                }
            >
                <h1>DO SOMETHING FORM</h1>
            </Modal>
            <DropZone />
            <Playlists
                currentPlaylistId={props.currentPlaylistId}
                tree={props.tree}
                handleAction={props.handleAction}
            />
        </aside>
    );
}
