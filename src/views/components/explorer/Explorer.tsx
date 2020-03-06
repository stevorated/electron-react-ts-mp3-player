import React, { useRef } from 'react';

import { Playlists } from './partials';
import { TreeListType } from '../../interfaces';
import { IPlaylist } from '../../../services/db';
import './Explorer.style.less';
import {
    FaPlusCircle,
    FaAccusoft,
    FaPlus,
    FaPoop,
    FaPoo,
} from 'react-icons/fa';
import { Modal } from '../shared/Modal';
import { HandlerAction } from '../../interfaces';
import { ExplorerBtn } from './partials/ExplorerBtn';
import { Ipc } from './../../tools/Ipc';

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
                    props.handleAction('createPlaylist');
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
            <div
                style={{
                    display: 'flex',
                    height: '20vh',
                    border: '2px dashed rgba(200, 200, 200, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <h3>Drop Here?</h3>
            </div>
            <Playlists tree={props.tree} handleAction={props.handleAction} />
        </aside>
    );
}
