import React, { FormEvent, useState } from 'react';
import { FaFolderOpen, FaFolder } from 'react-icons/fa';

import { Playlist } from './Playlist';
import { TreeItemBox } from './TreeItemBox';
import { TreeListType, HandlerAction } from '../../../interfaces';

type Props = {
    playlists: TreeListType[];
    title: string;
    id?: number;
    item: TreeListType;
    handleAction: (action: HandlerAction, payload?: any) => void;
};

export function Folder(props: Props) {
    const { playlists, id, handleAction, item } = props;
    const [show, setShow] = useState(false);

    const toggleNested = (e: FormEvent) => {
        setShow(!show);
    };

    const renderPlaylists = () =>
        playlists?.map(({ id: itemId, title, nested, type }) => {
            if (type === 'folder') {
                return (
                    <Folder
                        handleAction={handleAction}
                        key={itemId}
                        item={item}
                        id={itemId || 0}
                        title={title}
                        playlists={nested}
                    />
                );
            } else {
                return (
                    <Playlist
                        item={item}
                        handleAction={handleAction}
                        key={itemId}
                        id={itemId || 0}
                        title={title}
                    />
                );
            }
        });

    return (
        <li key={id}>
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
