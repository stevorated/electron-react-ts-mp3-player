import React, { FormEvent, useState } from 'react';

import { Playlist } from './Playlist';
import { TreeItemBox } from './TreeItemBox';
import { TreeListType } from '../../../interfaces';
import { FaFolderOpen, FaFolder } from 'react-icons/fa';

type Props = {
    playlists: TreeListType[];
    title: string;
    id: number;
    handleAction: (action: string, payload: any) => void;
};

export function Folder(props: Props) {
    const { playlists, id, handleAction } = props;
    const [show, setShow] = useState(false);

    const toggleNested = (e: FormEvent) => {
        setShow(!show);
    };

    const renderPlaylists = () =>
        playlists?.map(({ id, title, nested, type }) => {
            if (type === 'folder') {
                return (
                    <Folder
                        handleAction={handleAction}
                        key={id}
                        id={id}
                        title={title}
                        playlists={nested}
                    />
                );
            } else {
                return (
                    <Playlist
                        handleAction={handleAction}
                        key={id}
                        id={id}
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
                <TreeItemBox onClick={toggleNested} title={props.title} />
            </div>
            <ul className={show ? '' : 'hide'}>{renderPlaylists()}</ul>
        </li>
    );
}
