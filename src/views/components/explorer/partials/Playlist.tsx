import React, { useState, KeyboardEvent } from 'react';

import { HandlerAction, TreeListType } from '@views/interfaces';
import { StateHandlerAction } from '@views/interfaces';

import { Ipc } from '../../../tools';
import { Editable } from './Editable';

type Props = {
    id: number;
    currentPlaylistId: number;
    title: string;
    playlist: TreeListType;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any,
        extra?: any
    ) => void;
};

export function Playlist({
    id,
    title,
    handleAction,
    playlist,
    currentPlaylistId,
}: Props) {
    const [isEditing, setEditing] = useState(false);
    const [afterEdit, setAfterEdit] = useState('');
    const [newId, setNewId] = useState(-1);

    const handleClick = () => {
        handleAction('SWITCH_PLAYLIST', newId === -1 ? id : newId);
    };

    const handleDoubleClick = () => {
        if (!isEditing) {
            setAfterEdit(playlist.title);
            setEditing(true);
        }
    };

    const saveItem = async () => {
        try {
            if (!isEditing) {
                console.log(afterEdit);
                const id = await Ipc.invoke<number>('SAVE_PLAYLIST', afterEdit);
                setNewId(id);
                handleAction(
                    'SAVE_PLAYLIST',
                    {
                        ...playlist,
                        title: afterEdit,
                        id: id,
                    },
                    -1
                );
            } else {
                await Ipc.invoke('UPDATE_PLAYLIST', {
                    ...playlist,
                    title: afterEdit,
                });

                handleAction('UPDATE_PLAYLIST', {
                    ...playlist,
                    title: afterEdit,
                });
            }
        } catch (err) {
            new Error('unable to save!!');
        }

        setEditing(false);
    };

    const handleDelete = async (temp: boolean = false) => {
        handleAction('DELETE_PLAYLIST', { playlist, temp });
    };

    const onBlurEdit = () => {
        !!afterEdit
            ? saveItem()
            : !isEditing
            ? handleDelete(true)
            : setEditing(false);
    };

    const handleKeyDown = async (
        event: KeyboardEvent<HTMLDivElement> | KeyboardEvent<HTMLLIElement>
    ) => {
        event.keyCode === 13 && afterEdit !== '' && saveItem();
    };

    return (
        <Editable
            id={id}
            currentPlaylistId={currentPlaylistId}
            handleDoubleClick={handleDoubleClick}
            handleClick={handleClick}
            save={saveItem}
            handleDelete={handleDelete}
            item={playlist}
            text="..."
            type="text"
            placeholder={id === -1 ? '...' : title}
            afterEdit={afterEdit}
            isEditing={id === -1 ? true : isEditing}
            setAfterEdit={setAfterEdit}
            setEditing={setEditing}
            onBlur={onBlurEdit}
            handleKeyDown={handleKeyDown}
        />
    );
}
