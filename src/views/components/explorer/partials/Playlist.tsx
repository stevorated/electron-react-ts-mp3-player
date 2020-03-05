import React, { FormEvent } from 'react';
import { FaMusic } from 'react-icons/fa';

type Props = {
    id: number;
    title: string;
    handleAction: (action: string, payload: any) => void;
};

export function Playlist({ id, title, handleAction }: Props) {
    const handleClick = (e: FormEvent) => {
        handleAction('switch', id);
    };

    return (
        <li className="tree-item" key={id}>
            <div className="tree-item-title" onClick={handleClick}>
                <FaMusic />
                <div style={{ marginLeft: '10px' }}>{title}</div>
            </div>
        </li>
    );
}
