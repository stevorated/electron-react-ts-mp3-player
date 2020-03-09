import React, { useState, KeyboardEvent } from 'react';
import { ipcRenderer } from 'electron';
import { FaMusic } from 'react-icons/fa';

import { HandlerAction, TreeListType } from '@views/interfaces';

import { Editable } from './Editable';

type Props = {
    id: number;
    currentPlaylistId: number;
    title: string;
    playlist: TreeListType;
    handleAction: (action: HandlerAction, payload?: any, extra?: any) => void;
};

export function Playlist({
    id,
    title,
    handleAction,
    playlist,
    currentPlaylistId,
}: Props) {
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
                    ...playlist,
                    title: afterEdit,
                    id: payload,
                },
                -1
            );
        });

        setEditing(false);
    };

    const deleteItem = () => {
        handleAction('DELETE_PLAYLIST', playlist);
        setEditing(false);
    };

    const onBlurEdit = () => {
        afterEdit !== '' ? saveItem() : deleteItem();
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLDivElement>) => {
        event.keyCode === 13 && afterEdit !== '' && saveItem();
    };

    return id !== -1 ? (
        <li
            className={`tree-item ${currentPlaylistId === id ? 'active' : ''}`}
            key={id}
            onClick={handleClick}
        >
            <div className="tree-item-title">
                <FaMusic />
                <div style={{ marginLeft: '10px' }}>
                    {title}
                    <span className="tiny-text">
                        {playlist.nested.length} songs
                    </span>
                </div>
            </div>
        </li>
    ) : (
        <li id="new_playlist_temp" className="tree-item" key={id}>
            <Editable
                handleClick={handleClick}
                save={saveItem}
                item={playlist}
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
