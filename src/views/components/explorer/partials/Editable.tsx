import React, { useRef, useEffect, KeyboardEvent, useState } from 'react';
import { FaMusic } from 'react-icons/fa';
import styled, { css } from 'styled-components';

import { DeleteBtn } from './DeleteBtn';
import { DeletePlaylistModal } from './DeletePlaylistModal';
import { Modal } from '../../shared';
import { TreeListType } from '../../../interfaces';
import { colors } from '../../../assets/consts';

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
                <TreeItem
                    active={currentPlaylistId === id}
                    key={id}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    onKeyDown={e => handleKeyDown(e)}
                    onBlur={onBlur}
                >
                    <TreeItemTitle>
                        <FaMusic size="12px" />
                        <EditPlaylistInput
                            type="text"
                            ref={inputRef}
                            value={afterEdit}
                            onChange={e => setAfterEdit(e.target.value)}
                        />
                    </TreeItemTitle>
                </TreeItem>
            ) : (
                <TreeItem active={currentPlaylistId === id} key={id}>
                    <TreeItemTitle ref={titleRef}>
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
                    </TreeItemTitle>
                    <TinyText className="tiny-text">
                        {item?.nested.length} songs
                    </TinyText>
                </TreeItem>
            )}
        </section>
    );
}

const EditPlaylistInput = styled.input`
    margin-left: 10px;
`;

const TreeItem = styled.li`
    display: inline;
    flex: inline;
    ${({ active }: { active: boolean }) =>
        active &&
        css`
            color: ${colors.activeTextColor};
            font-weight: 700;
        `}
`;

const TinyText = styled.span`
    color: ${colors.mediumTextColor};
    margin-left: 20px;
    padding-top: 0;
    font-size: 9px;
`;

const TreeItemTitle = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
    transition: all 0.1s ease;
`;

const TitleDiv = styled.div`
    margin-left: 10px;
    &:hover {
        cursor: pointer;
        transform: translateY(-1px);
    }
`;
