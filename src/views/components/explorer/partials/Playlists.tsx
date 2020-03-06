import React from 'react';
import { Playlist } from './Playlist';
import { Folder } from './Folder';

import { TreeListType, HandlerAction } from '../../../interfaces';

type Props = {
    tree: TreeListType[];
    handleAction: (action: HandlerAction, payload?: any) => void;
};

export function Playlists(props: Props) {
    const { tree, handleAction } = props;

    const renderTree = () =>
        tree.map(item => {
            if (item.type === 'folder') {
                return (
                    <Folder
                        key={`folder-tree-item-${item.id}`}
                        id={item.id}
                        item={item}
                        title={item.title}
                        playlists={item.nested}
                        handleAction={handleAction}
                    />
                );
            } else {
                return (
                    <Playlist
                        key={`playlist-tree-item-${item.id}`}
                        id={item.id || 0}
                        item={item}
                        title={item.title}
                        handleAction={props.handleAction}
                    />
                );
            }
        });

    return (
        <div>
            <ul>{renderTree()}</ul>
        </div>
    );
}
