import React, { useState, useEffect } from 'react';

import { HandlerAction, TreeListType } from '@views/interfaces';
import { StateHandlerAction } from '@views/interfaces';

import { EQBars } from './EQBars';
import { Songs } from './Songs';
import { ISong } from '@services/db';

type Props = {
    current?: TreeListType;
    pointer: number;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload: any
    ) => void;
    status: string;
};

export function SongsListContainer({
    current,
    pointer,
    handleAction,
    status,
}: Props) {
    // const { nested } = current || {};
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
                playlistId={current?.id}
                status={status}
                songs={current?.nested as ISong[]}
                pointer={pointer}
                handleAction={handleAction}
            />
        </div>
    );
}
