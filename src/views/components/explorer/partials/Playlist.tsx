import React, { FunctionComponent, FormEvent } from 'react';

type Props = {
    id: number;
    title: string;
};

export const Playlist: FunctionComponent<Props> = (props: Props) => {
    const handleClick = (e: FormEvent) => {
        console.log(e.target);
        console.log('CLICKED PLAYLIST', props.id);
    };

    return (
        <li className="tree-item" key={props.id}>
            <p className="tree-item-title" onClick={handleClick}>
                {props.title}
            </p>
        </li>
    );
};
