import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { FaMusic } from 'react-icons/fa';
import { TreeListType } from '../../../interfaces';
import { CloseBtn } from './CloseBtn';

type Props = {
    id: number;
    currentPlaylistId: number;
    text: string;
    type: string;
    placeholder: string;
    item: TreeListType;
    afterEdit: string;
    handleClick: () => void;
    handleDoubleClick: () => void;
    setAfterEdit: (newState: string) => void;
    setEditing: (newState: boolean) => void;
    onBlur: () => void;
    handleKeyDown: (event: KeyboardEvent<HTMLLIElement>) => void;
    isEditing: boolean;
    save: () => void;
};

export function Editable({
    placeholder,
    afterEdit,
    setAfterEdit,
    isEditing,
    handleClick,
    handleKeyDown,
    onBlur,
    item,
    handleDoubleClick,
    currentPlaylistId,
    id,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef?.current) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    return (
        <section style={{ height: '3rem' }}>
            {isEditing ? (
                <li
                    className={`tree-item playlist ${
                        currentPlaylistId === id ? 'active' : ''
                    }`}
                    key={id}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    onKeyDown={e => handleKeyDown(e)}
                    onBlur={onBlur}
                >
                    <div className="tree-item-title">
                        <FaMusic size="12px" />
                        <input
                            type="text"
                            className="edit-playlist-input"
                            ref={inputRef}
                            value={afterEdit}
                            onChange={e => setAfterEdit(e.target.value)}
                        />
                    </div>
                </li>
            ) : (
                <li
                    className={`tree-item playlist ${
                        currentPlaylistId === id ? 'active' : ''
                    }`}
                    key={id}
                    style={{ flex: 'inline' }}
                >
                    <div className="tree-item-title">
                        <FaMusic size="12px" />
                        <div
                            className="hoverable-alt"
                            style={{ marginLeft: '10px' }}
                            onClick={handleClick}
                            onDoubleClick={handleDoubleClick}
                        >
                            {afterEdit || placeholder}
                        </div>

                        <CloseBtn id={id} />
                    </div>
                    <span className="tiny-text">
                        {item?.nested.length} songs
                    </span>
                </li>
            )}
        </section>
    );
}

// function EditableItem({
//     onBlur,
//     handleKeyDown,
//     afterEdit,
//     setAfterEdit,
// }: Partial<Props>) {
//     return (
//         <div
//             className="tree-item-title"
//             onBlur={onBlur}
//             onKeyDown={e => handleKeyDown && handleKeyDown(e)}
//         >
//             <FaMusic />
//             <input
//                 value={afterEdit}
//                 onChange={e => setAfterEdit && setAfterEdit(e.target.value)}
//                 style={{ marginLeft: '10px' }}
//                 type="text"
//             />
//         </div>
//     );
// }
