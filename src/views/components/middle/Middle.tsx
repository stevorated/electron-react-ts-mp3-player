import React, { FunctionComponent } from 'react';
import { PlayerContainer, SongsListContainer } from './partials';

type Props = {};

export const Middle: FunctionComponent<Props> = () => {
    return (
        <div className="flexbox-item-grow main">
            <PlayerContainer />
            <SongsListContainer />
        </div>
    );
};
