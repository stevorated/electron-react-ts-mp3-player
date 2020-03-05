import React, { FunctionComponent } from 'react';

type Props = {
    title: string;
    onClick: (e: React.FormEvent) => void;
};

export function TreeItemBox(props: Props, {}) {
    return (
        <div className="tree-item" onClick={props.onClick}>
            <p className="tree-item-title">{props.title}</p>
        </div>
    );
}
