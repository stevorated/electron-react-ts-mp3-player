import React, { useState, ReactNode, KeyboardEvent } from 'react';
import { FaMusic } from 'react-icons/fa';
import { HandlerAction, TreeListType } from '../../../interfaces';
import { v4 as uuid } from 'uuid';

type Props = {
    text: string;
    type: string;
    placeholder: string;
    item: TreeListType;
    afterEdit: string;
    handleClick: () => void;
    setAfterEdit: (newState: string) => void;
    setEditing: (newState: boolean) => void;
    onBlur: () => void;
    handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
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
}: Props) {
    return (
        <section>
            {isEditing ? (
                <div
                    className="tree-item-title"
                    onBlur={onBlur}
                    onKeyDown={e => handleKeyDown(e)}
                >
                    <FaMusic />
                    <input
                        value={afterEdit}
                        onChange={e => setAfterEdit(e.target.value)}
                        style={{ marginLeft: '10px' }}
                        type="text"
                    />
                </div>
            ) : (
                <div className="tree-item-title" onClick={handleClick}>
                    <FaMusic />
                    <div style={{ marginLeft: '10px' }}>
                        {afterEdit || placeholder}
                    </div>
                </div>
            )}
        </section>
    );
}

function EditableItem({
    onBlur,
    handleKeyDown,
    afterEdit,
    setAfterEdit,
}: Partial<Props>) {
    return (
        <div
            className="tree-item-title"
            onBlur={onBlur}
            onKeyDown={e => handleKeyDown && handleKeyDown(e)}
        >
            <FaMusic />
            <input
                value={afterEdit}
                onChange={e => setAfterEdit && setAfterEdit(e.target.value)}
                style={{ marginLeft: '10px' }}
                type="text"
            />
        </div>
    );
}
