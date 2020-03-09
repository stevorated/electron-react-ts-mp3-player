import React from 'react';
import { Playlist } from './Playlist';
import { Folder } from './Folder';

import { TreeListType, HandlerAction } from '../../../interfaces';

type Props = {
    currentPlaylistId: number;
    tree: TreeListType[];
    handleAction: (action: HandlerAction, payload?: any) => void;
};

export function Playlists(props: Props) {
    const { tree, handleAction, currentPlaylistId } = props;

    const renderTree = () =>
        tree.map(item => {
            if (item.type === 'folder') {
                return (
                    <Folder
                        key={`folder-tree-item-${item.id}`}
                        currentPlaylistId={currentPlaylistId}
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
                        playlist={item}
                        title={item.title}
                        currentPlaylistId={currentPlaylistId}
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
