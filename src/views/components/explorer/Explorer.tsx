import React, { Component } from 'react';
import { Playlists } from './partials';
import { treeMock } from '../../constants/mocks';

import './Explorer.style.less';
import { RootState } from 'src/views/store';
import { connect } from 'react-redux';
import { PlaylistType } from 'src/views/constants/mocks';

export class Explorer extends Component<{ playlists: PlaylistType[] }> {
    render() {
        return (
            <aside className="flexbox-item-grow sidebar">
                …
                <Playlists playlists={this.props.playlists} />
            </aside>
        );
    }
}

const mapStateToProps = ({ playlists }: RootState) => {
    return { playlists };
};

export const ExplorerLoaded = connect(mapStateToProps)(Explorer);
