import React, { FormEvent, useState, FunctionComponent } from 'react';
import { Playlist } from './Playlist';

import { TreeListType } from '../../../constants/mocks';
import { TreeItemBox } from './TreeItemBox';

type Props = {
    playlists: TreeListType[];
    title: string;
    id: number;
};

export const Folder: FunctionComponent<Props> = (props: Props) => {
    const { playlists, id } = props;
    const [show, setShow] = useState(false);

    const toggleNested = (e: FormEvent) => {
        setShow(!show);
    };

    const renderPlaylists = () =>
        playlists.map(({ id, title, nested }) => {
            if (nested.length === 0) {
                return <Playlist key={id} id={id} title={title} />;
            } else {
                return (
                    <Folder key={id} id={id} title={title} playlists={nested} />
                );
            }
        });

    return (
        <li key={id}>
            <TreeItemBox onClick={toggleNested} title={props.title} />
            <ul className={show ? '' : 'hide'}>{renderPlaylists()}</ul>
        </li>
    );
};
