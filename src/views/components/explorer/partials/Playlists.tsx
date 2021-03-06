import React from 'react';
import { Playlist } from './Playlist';
import { Folder } from './Folder';

import { TreeListType, AllHandlerActions } from '../../../interfaces';

type Props = {
    currentPlaylistId: number;
    tree: TreeListType[];
    handleAction: (action: AllHandlerActions, payload?: any) => Promise<void>;
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
                        nestedItems={item.nested as TreeListType[]}
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

    return <ul>{renderTree()}</ul>;
}
