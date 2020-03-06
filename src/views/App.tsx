import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { IPage, TreeListType, HandlerAction } from './interfaces';
import { loadAllPlaylists, RootState, loadTree } from './store';
import { Ipc } from './tools';
import { IPlaylist } from '../services/db';

import './App.style.less';

import { MainPage } from './pages';
import {
    createTempTreePlaylist,
    updateTreePlaylist,
    deleteFromTree
} from './store/actions';

export class App extends Component<IPage, {}> {
    constructor(props: any) {
        super(props);

        const { currentPlaylistId } = this.state;
        const { playlists } = this.props;
        const [current] = playlists
            ? playlists?.filter(
                  pl => typeof pl.id === 'number' && pl.id === currentPlaylistId
              )
            : [];

        if (!this.state?.current && current.length > 0) {
            this.setState({ current });
        }

        Ipc.sendAndReduce('FETCH_PLAYLISTS', this.props.loadAllPlaylists);
        Ipc.sendAndReduce('FETCH_TREE', this.props.loadTree);
    }

    state = {
        theme: 'dark',
        currentPlaylistId: 2,
        pointer: 0,
        waitBetween: 0.5,
        current: [],
        status: 'stoped',
        songsArr: [
            'C:\\Users\\garbe\\Desktop\\album\\album_1\\Actually Not Master.mp3',
            'C:\\Users\\garbe\\Desktop\\album\\album_1\\Fragments Master.mp3',
        ],
    };

    handleAction = (action: HandlerAction, payload?: any, extra?: any) => {
        const { pointer, songsArr, status } = this.state;

        switch (action) {
            case 'switch':
                return this.setState({
                    currentPlaylistId: payload,
                });
            case 'changeSong':
                if (songsArr[payload]) {
                    if (payload === pointer) {
                        console.log('HERE', status);
                        status === 'playing' ? this.pause() : this.play();
                    } else {
                        this.play();
                    }
                    this.setState({ pointer: payload });
                } else {
                    this.pause();
                }
                return;
            case 'openCreatePlaylistModal':
                Ipc.sendAndRecieve('TOGGLE_NEW_PLAYLIST_MODAL');
                return;
            case 'statusChange':
                this.setState({ status: payload });
                return;
            case 'createPlaylist':
                this.props.createPlaylist();
                return;
            case 'updateTree':
                this.props.updateTree(payload, extra);
                return;
            case 'deleteTreeItem':
                this.props.deleteFromTree(payload);
                return;
            default:
                console.log(
                    `unknown action: ${action}, with payload: ${payload}`
                );
                break;
        }
    };

    getPlayer = () =>
        document.getElementById('media-player') as HTMLMediaElement;

    play = () => {
        const { waitBetween } = this.state;
        const player = this.getPlayer();
        this.setState({ status: 'playing' });
        setTimeout(() => {
            player.play();
        }, waitBetween * 1000);
    };

    pause = () => {
        const player = this.getPlayer();
        this.setState({ status: 'paused' });
        player.pause();
    };

    render() {
        const { tree, playlists } = this.props;
        const { currentPlaylistId, pointer, waitBetween, status } = this.state;
        const [current] = playlists
            ? playlists?.filter(
                  pl => typeof pl.id === 'number' && pl.id === currentPlaylistId
              )
            : [];

        return (
            <MainPage
                handleAction={this.handleAction}
                playlists={this.props.playlists}
                tree={tree}
                status={status}
                songs={this.state.songsArr}
                play={this.play}
                current={current || []}
                pointer={pointer}
                waitBetween={waitBetween}
            />
        );
    }
}

const mapStateToProps = ({ playlists, tree }: RootState) => {
    return { playlists, tree };
};

type DispatchProps = {
    loadAllPlaylists?: (payload: IPlaylist[]) => void;
    loadTree?: (payload: TreeListType[]) => void;
    createPlaylist?: (payload?: TreeListType) => void;
    updateTree: (payload: TreeListType, extra?: any) => void;
    deleteFromTree: (payload: TreeListType) => void;
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    loadAllPlaylists: (payload: IPlaylist[]) =>
        dispatch(loadAllPlaylists(payload)),
    loadTree: (payload: TreeListType[]) => dispatch(loadTree(payload)),
    createPlaylist: (payload?: TreeListType) =>
        dispatch(createTempTreePlaylist(payload)),
    updateTree: (payload: TreeListType, extra?: any) =>
        dispatch(updateTreePlaylist(payload, extra)),
        deleteFromTree: (payload: TreeListType) => dispatch(deleteFromTree(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
