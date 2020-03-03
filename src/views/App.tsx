import React, { Component } from 'react';

import PageInterface from './interfaces/props.interfaces';
// import img from './assets/img/cuttree.jpg';
// import font from './assets/img/Allerta-Regular.ttf';
import { Status, Info, ExplorerLoaded, Middle } from './components';
import { PlaylistActions } from './interfaces/data.interfaces';

import './App.style.less';
import { RootState } from './store/reducers';
import { connect } from 'react-redux';
import { loadAllPlaylists } from './store';
import { Dispatch } from 'redux';
import { PlaylistType } from './constants/mocks';

export class App extends Component<PageInterface, {}> {
    constructor(props: any) {
        super(props);
        const { ipcRenderer, remote } = window.require('electron');

        ipcRenderer.send('FETCH_PLAYLIST_EXPLORER');

        ipcRenderer.on('FETCH_PLAYLIST_EXPLORER', (e, args) => {
            console.log('got playlists');
            console.log(args);
            console.log(this.props.playlists);
            this.props.loadAllPlaylists(args);
            console.log(this.props.playlists);
        });
    }
    render() {
        return (
            <>
                <div className="fill-area flexbox-item-grow">
                    <ExplorerLoaded />
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
