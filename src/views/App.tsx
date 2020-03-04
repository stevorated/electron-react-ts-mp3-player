import React, { Component } from 'react';

import PageInterface from './interfaces/props.interfaces';
// import img from './assets/img/cuttree.jpg';
// import font from './assets/img/Allerta-Regular.ttf';
import { Status, Info, Explorer, Middle } from './components';
import { PlaylistActions } from './interfaces/data.interfaces';

import './App.style.less';
import { RootState } from './store/reducers';
import { connect } from 'react-redux';
import { loadAllPlaylists } from './store';
import { Dispatch } from 'redux';
import { PlaylistType } from './interfaces';
import { IpcService } from './services/IpcService';

export class App extends Component<PageInterface, {}> {
    constructor(props: any) {
        super(props);
        IpcService.sendAndReduce(
            'FETCH_PLAYLIST_EXPLORER',
            this.props.loadAllPlaylists
        );
    }

    state = {
        theme: 'dark'
    }

    handleAction = (action: string, payload: any) => {
        switch (action) {
            default:
                console.log(
                    `unknown action: ${action}, with payload: ${payload}`
                );
                break;
        }
    };
    render() {
        return (
            <>
                <div className="fill-area flexbox-item-grow">
                    <Explorer
                        handleAction={this.handleAction}
                        playlists={this.props.playlists}
                    />
                    <Middle />
                    <Info />
                </div>
                <Status />
            </>
        );
    }
}

const mapStateToProps = ({ playlists }: RootState) => {
    return { playlists };
};

const mapDispatchToProps = (
    dispatch: Dispatch
): { loadAllPlaylists: (payload: PlaylistType[]) => {} } => ({
    loadAllPlaylists: (payload: PlaylistType[]) =>
        dispatch(loadAllPlaylists(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
