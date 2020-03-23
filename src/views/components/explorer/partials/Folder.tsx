import React, { useState } from 'react';
import { FaFolderOpen, FaFolder } from 'react-icons/fa';

import { Playlist } from './Playlist';
import { TreeItemBox } from './TreeItemBox';
import {
    TreeListType,
    HandlerAction,
    StateHandlerAction,
} from '../../../interfaces';

type Props = {
    nestedItems: TreeListType[];
    currentPlaylistId: number;
    title: string;
    id?: number;
    item: TreeListType;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => Promise<void>;
};

export function Folder(props: Props) {
    const { nestedItems, id, handleAction, item, currentPlaylistId } = props;
    const [show, setShow] = useState(false);

    const toggleNested = () => {
        setShow(!show);
    };

    const renderPlaylists = () =>
        nestedItems?.map(({ id: itemId, title, nested, type }) => {
            if (type === 'folder') {
                return (
                    <Folder
                        currentPlaylistId={currentPlaylistId}
                        handleAction={handleAction}
                        key={itemId}
                        item={item}
                        id={itemId || 0}
                        title={title}
                        nestedItems={nested as TreeListType[]}
                    />
                );
            } else {
                return (
                    <Playlist
                        playlist={item}
                        currentPlaylistId={currentPlaylistId}
                        handleAction={handleAction}
                        key={itemId}
                        id={itemId || 0}
                        title={title}
                    />
                );
            }
        });

    return (
        <li key={id} className="tree-item">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                }}
            >
                {show ? <FaFolderOpen size="20px" /> : <FaFolder size="20px" />}
                <TreeItemBox
                    itemId={id || 0}
                    onClick={toggleNested}
                    title={props.title}
                />
            </div>
            <ul className={show ? '' : 'hide'}>{renderPlaylists()}</ul>
        </li>
    );
}
