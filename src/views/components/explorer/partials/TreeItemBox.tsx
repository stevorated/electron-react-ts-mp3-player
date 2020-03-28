import React, { FunctionComponent } from 'react';

type Props = {
    title: string;
    onClick: (e: React.FormEvent) => void;
};

export const TreeItemBox: FunctionComponent<Props> = (props: Props, {}) => {
    return (
        <div className="tree-item" onClick={props.onClick}>
            <p className="tree-item-title">{props.title}</p>
        </div>
    );
};
