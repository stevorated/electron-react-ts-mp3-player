import React from 'react';

type Props = {
    itemId: number;
    title: string;
    onClick: (e: React.FormEvent) => void;
};

export function TreeItemBox(props: Props, {}) {
    return (
        <div className="tree-item" onClick={props.onClick}>
            <p className="tree-item-title" style={{ marginLeft: '7px' }}>
                {props.title}
            </p>
        </div>
    );
}
