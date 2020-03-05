import React, { Component } from 'react';

import PageInterface from './interfaces/props.interfaces';
// import img from './assets/img/cuttree.jpg';
// import font from './assets/img/Allerta-Regular.ttf';
import { Status, Info, Explorer, Middle } from './components';
import { PlaylistActions, TreeListType } from './interfaces/data.interfaces';

import './App.style.less';
import { RootState } from './store/reducers';
import { connect } from 'react-redux';
import { loadAllPlaylists } from './store';
import { Dispatch } from 'redux';
import { IPlaylist } from '../services/db';
import { IpcConnector } from './tools/IpcConnector';
import { loadTree } from './store/actions/tree.actions';

export class App extends Component<PageInterface, {}> {
    constructor(props: any) {
        super(props);
        IpcConnector.sendAndReduce(
            'FETCH_PLAYLIST_EXPLORER',
            this.props.loadAllPlaylists
        );
        IpcConnector.sendAndReduce('FETCH_TREE', this.props.loadTree);
    }

    state = {
        theme: 'dark',
        currentPlaylistId: 2,
    };

    handleAction = (action: string, payload: any) => {
        switch (action) {
            case 'switch':
                console.log('SWITCH', payload);
                return this.setState({
                    currentPlaylistId: payload,
                });
            default:
                console.log(
                    `unknown action: ${action}, with payload: ${payload}`
                );
                break;
        }
    };
    render() {
        const { tree, playlists } = this.props;
        const { currentPlaylistId } = this.state;

        return (
            <>
                <div className="fill-area flexbox-item-grow">
                    <Explorer
                        handleAction={this.handleAction}
                        playlists={this.props.playlists}
                        tree={tree}
                    />
                    <Middle
                        playlists={playlists}
                        currentPlaylistId={currentPlaylistId}
                    />
                    <Info />
                </div>
                <Status />
            </>
        );
    }
}

const mapStateToProps = ({ playlists, tree }: RootState) => {
    return { playlists, tree };
};

type DispatchProps = {
    loadAllPlaylists?: (payload: IPlaylist[]) => void;
    loadTree?: (payload: TreeListType[]) => void;
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    loadAllPlaylists: (payload: IPlaylist[]) =>
        dispatch(loadAllPlaylists(payload)),
    loadTree: (payload: TreeListType[]) => dispatch(loadTree(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
