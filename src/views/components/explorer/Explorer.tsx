import React from 'react';
import { FaPlusCircle, FaPoo } from 'react-icons/fa';

import { IPlaylist } from '@services/db';
import { HandlerAction, TreeListType } from '@views/interfaces';

import { ExplorerBtn } from './partials';
import { Playlists } from './partials';
import { Modal, DropZone } from '../shared';

import './Explorer.style.less';

type Props = {
    playlists: IPlaylist[];
    tree: TreeListType[];
    handleAction: (action: HandlerAction, payload?: any) => void;
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
                    props.handleAction('CREATE_PLAYLIST');
                }}
            />
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
            <Playlists tree={props.tree} handleAction={props.handleAction} />
        </aside>
    );
}
