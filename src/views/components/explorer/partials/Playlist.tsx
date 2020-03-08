import React, { useState, KeyboardEvent } from 'react';
import { FaMusic } from 'react-icons/fa';

import { HandlerAction, TreeListType } from '../../../interfaces';
import { Editable } from './Editable';
import { Ipc } from './../../../tools/Ipc';
import { ipcRenderer } from 'electron';

type Props = {
    id: number;
    title: string;
    item: TreeListType;
    handleAction: (action: HandlerAction, payload?: any, extra?: any) => void;
};

export function Playlist({ id, title, handleAction, item }: Props) {
    const [isEditing, setEditing] = useState(true);
    const [afterEdit, setAfterEdit] = useState('');
    const [newId, setNewId] = useState(-1);

    const handleClick = () => {
        handleAction('HANDLE_SWITCH_PLAYLIST', newId === -1 ? id : newId);
    };

    const saveItem = async () => {
        ipcRenderer.invoke('SAVE_PLAYLIST', afterEdit).then(payload => {
            setNewId(payload);
            handleAction(
                'CREATE_PLAYLIST_SAVE',
                {
                    ...item,
                    title: afterEdit,
                    id: payload,
                },
                -1
            );
        });

        setEditing(false);
    };

    const deleteItem = () => {
        handleAction('DELETE_PLAYLIST', item);
        setEditing(false);
    };

    const onBlurEdit = () => {
        afterEdit !== '' ? saveItem() : deleteItem();
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLDivElement>) => {
        event.keyCode === 13 && afterEdit !== '' && saveItem();
    };

    return id !== -1 ? (
        <li className="tree-item" key={id} onClick={handleClick}>
            <div className="tree-item-title">
                <FaMusic />
                <div style={{ marginLeft: '10px' }}>{title}</div>
            </div>
        </li>
    ) : (
        <li id="new_playlist_temp" className="tree-item" key={id}>
            <Editable
                handleClick={handleClick}
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
