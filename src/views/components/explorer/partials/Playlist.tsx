import React, { useState, KeyboardEvent } from 'react';
import { FaMusic } from 'react-icons/fa';

import { HandlerAction, TreeListType } from '../../../interfaces';
import { Editable } from './Editable';
import { Ipc } from './../../../tools/Ipc';

type Props = {
    id: number;
    title: string;
    item: TreeListType;
    handleAction: (action: HandlerAction, payload?: any, extra?: any) => void;
};

export function Playlist({ id, title, handleAction, item }: Props) {
    const handleClick = () => {
        handleAction('switch', id);
    };

    const [isEditing, setEditing] = useState(true);
    const [afterEdit, setAfterEdit] = useState('');

    const saveItem = async () => {
        handleAction(
            'updateTree',
            {
                ...item,
                title: afterEdit,
                id: Math.round(Math.random() * 10000),
            },
            666
        );
        setEditing(false);
        Ipc.sendAndRecieve('SAVE_PLAYLIST', item);
    };

    const deleteItem = () => {
        handleAction('deleteTreeItem', item);
        setEditing(false);
    };

    const onBlurEdit = () => {
        afterEdit !== '' ? saveItem() : deleteItem();
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLDivElement>) => {
        event.keyCode === 13 && afterEdit !== '' && saveItem();
    };

    return id !== 666 ? (
        <li className="tree-item" key={id} onClick={handleClick}>
            <div className="tree-item-title">
                <FaMusic />
                <div style={{ marginLeft: '10px' }}>{title}</div>
            </div>
        </li>
    ) : (
        <li id="new_playlist_temp" className="tree-item" key={id}>
            <Editable
                save={saveItem}
                item={item}
                text="text"
                type="text"
                placeholder="…"
                afterEdit={afterEdit}
                isEditing={isEditing}
                setAfterEdit={setAfterEdit}
                setEditing={setEditing}
                onBlur={onBlurEdit}
                handleKeyDown={handleKeyDown}
            />
        </li>
    );
}
