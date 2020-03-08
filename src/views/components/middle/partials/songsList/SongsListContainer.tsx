import React, { useState, useEffect } from 'react';

import { IPlaylist } from '@services/db';
import { HandlerAction } from '@views/interfaces';

import { EQBars } from './EQBars';
import { Songs } from './Songs';

type Props = {
    current?: IPlaylist;
    pointer: number;
    handleAction: (action: HandlerAction, payload: any) => void;
    status: string;
};

export function SongsListContainer({
    current,
    pointer,
    handleAction,
    status,
}: Props) {
    const { songs } = current || {};
    const [width, setWidth] = useState(window.innerWidth);

    const updateWidth = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    });

    return (
        <div className="main-body playlist-container">
            {current && <EQBars cols={Math.round((width - 300) / 41)} />}
            <Songs
                status={status}
                songs={songs}
                pointer={pointer}
                handleAction={handleAction}
            />
        </div>
    );
}
