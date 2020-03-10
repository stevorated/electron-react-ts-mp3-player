import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { FaMusic, FaPoo, FaTimes } from 'react-icons/fa';
import { TreeListType } from '../../../interfaces';

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
            inputRef?.current?.focus && inputRef?.current?.focus();
        }
    }, [isEditing]);

    return (
        <section>
            {isEditing ? (
                <li
                    className={`tree-item ${
                        currentPlaylistId === id ? 'active' : ''
                    }`}
                    key={id}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    onKeyDown={e => handleKeyDown(e)}
                    onBlur={onBlur}
                >
                    <div className="tree-item-title">
                        <FaMusic />
                        <input
                            ref={inputRef}
                            value={afterEdit}
                            onChange={e => setAfterEdit(e.target.value)}
                            style={{ marginLeft: '10px' }}
                            type="text"
                        />
                        <FaPoo />
                    </div>
                </li>
            ) : (
                <li
                    className={`tree-item ${
                        currentPlaylistId === id ? 'active' : ''
                    }`}
                    key={id}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                >
                    <div className="tree-item-title">
                        <FaMusic />
                        <div style={{ marginLeft: '10px', maxWidth: '250px' }}>
                            {afterEdit || placeholder}
                            <span className="tiny-text">
                                {item?.nested.length} songs
                            </span>
                        </div>
                        <div className="stick-right">
                            <FaTimes size={'10px'} />
                        </div>
                    </div>
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
