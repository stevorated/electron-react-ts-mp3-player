import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
// import { treeMock } from '../../constants/mocks';

import { Playlists } from './partials';
import { RootState } from '../../../views/store';
import { PlaylistType } from '../../interfaces';

import './Explorer.style.less';

type Props = {
    playlists: PlaylistType[];
    handleAction: (action: string, payload: any) => void;
};

export const Explorer: FunctionComponent<Props> = props => {
    return (
        <aside className="flexbox-item-grow sidebar">
            <h1>…</h1>

            <Playlists playlists={props.playlists} />
        </aside>
    );
};

// const mapStateToProps = ({ playlists }: RootState) => {
//     return { playlists };
// };

// export const ExplorerLoaded = connect(mapStateToProps)(Explorer);
