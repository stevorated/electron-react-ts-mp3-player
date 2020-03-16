import React, { useRef, useEffect, KeyboardEvent, useState } from 'react';
import { FaMusic } from 'react-icons/fa';
import styled from 'styled-components';

import { TreeListType } from '../../../interfaces';
import { DeleteBtn } from './DeleteBtn';
import { Modal } from '../../shared';
import DeletePlaylistModal from './DeletePlaylistModal';

type Props = {
    id: number;
    currentPlaylistId: number;
    text: string;
    type: string;
    placeholder: string;
    afterEdit: string;
    isEditing: boolean;
    item: TreeListType;
    handleClick: () => void;
    handleDoubleClick: () => void;
    handleDelete: (temp: boolean) => void;
    setAfterEdit: (newState: string) => void;
    setEditing: (newState: boolean) => void;
    onBlur: () => void;
    handleKeyDown: (event: KeyboardEvent<HTMLLIElement>) => void;
    save: () => void;
};

export function Editable({
    placeholder,
    afterEdit,
    setAfterEdit,
    isEditing,
    handleClick,
    handleKeyDown,
    handleDelete,
    onBlur,
    item,
    handleDoubleClick,
    currentPlaylistId,
    id,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (isEditing && inputRef?.current) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const boundingRect = titleRef.current?.getBoundingClientRect();

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
                    <div ref={titleRef} className="tree-item-title">
                        <FaMusic size="12px" />
                        <TitleDiv
                            onClick={handleClick}
                            onDoubleClick={handleDoubleClick}
                        >
                            {afterEdit || placeholder}
                        </TitleDiv>
                        <Modal
                            top={(boundingRect?.y || 0) / 2}
                            left={
                                (boundingRect?.x || 0) +
                                (boundingRect?.width || 0)
                            }
                            modalLabel="delete modal"
                            buttonText=""
                            isOpen={isDeleteModalOpen}
                            handleClosing={() => {
                                setIsDeleteModalOpen(false);
                            }}
                            button={
                                <DeleteBtn
                                    // handleDelete={() => handleDelete(false)}
                                    handleDelete={() => {
                                        setIsDeleteModalOpen(true);
                                    }}
                                />
                            }
                        >
                            <DeletePlaylistModal
                                closeModal={() => {
                                    setIsDeleteModalOpen(false);
                                }}
                                title={item.title}
                                size={item.nested.length}
                                handleDelete={() => handleDelete(false)}
                            />
                        </Modal>
                    </div>
                    <span className="tiny-text">
                        {item?.nested.length} songs
                    </span>
                </li>
            )}
        </section>
    );
}

const TitleDiv = styled.div`
    margin-left: 10px;
    &:hover {
        cursor: pointer;
        transform: translateY(-1px);
    }
`;

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
