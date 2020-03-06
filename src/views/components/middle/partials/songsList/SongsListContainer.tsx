import React, { useState, useEffect } from 'react';
import { EQBars } from './EQBars';
import { Songs } from './Songs';
// import { playlistsMock } from '../../../../constants/mocks';
import { IPlaylist } from '../../../../../services/db';
import { HandlerAction } from '../../../../interfaces';

type Props = {
    current: IPlaylist;
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
    const { songs } = current;
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
            <EQBars cols={Math.round((width - 300) / 41)} />
            <Songs
                status={status}
                rows={17}
                songs={songs || []}
                pointer={pointer}
                handleAction={handleAction}
            />
        </div>
    );
}
