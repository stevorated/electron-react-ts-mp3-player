import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { TreeListType, HandlerAction } from './interfaces';
import { loadAllPlaylists, RootState, fetchTree } from './store';
import { updateTreePlaylist, deleteFromTree } from './store';
import { createTempPlaylist } from './store';

import { IPlaylist } from '../services/db';
import { Ipc } from './tools';

import { MainPage } from './pages';

import './App.style.less';

type ComponentProps = {
    theme?: string;
};

type StateProps = {
    playlists: IPlaylist[];
    tree: TreeListType[];
};

type DispatchProps = {
    loadAllPlaylists: (payload: IPlaylist[]) => void;
    fetchTree: (payload: TreeListType[]) => void;
    updateTree: (payload: TreeListType, extra?: any) => void;
    createPlaylist: (payload?: TreeListType) => void;
    deleteFromTree: (payload: TreeListType) => void;
};

type Props = ComponentProps & DispatchProps & StateProps;

type State = {
    theme: string;
    currentPlaylistId: number;
    pointer: number;
    waitBetween: number;
    current?: IPlaylist;
    status: string;
    songsArr: string[];
};

export class App extends Component<Props, State> {
    componentDidMount = () => {
        Ipc.invoke('FETCH_TREE', this.handleAction);
        Ipc.invoke('FETCH_PLAYLISTS', this.handleAction);
    };

    setCurrentPlaylist = (payload: number) => {
        const { playlists } = this.props;
        const [current] = playlists?.filter(pl => pl.id && pl.id === payload);

        if (current) {
            this.setState({
                ...this.state,
                current,
                currentPlaylistId: payload,
            });
        }
    };

    state: State = {
        theme: 'dark',
        currentPlaylistId: 2,
        pointer: 0,
        waitBetween: 0.5,
        status: 'stoped',
        songsArr: [
            'C:\\Users\\garbe\\Desktop\\album\\album_1\\Actually Not Master.mp3',
            'C:\\Users\\garbe\\Desktop\\album\\album_1\\Fragments Master.mp3',
        ],
    };

    handleAction = (action: HandlerAction, payload?: any) => {
        const { pointer, songsArr, status, current } = this.state;
        const { fetchTree, updateTree } = this.props;
        const { createPlaylist, deleteFromTree, loadAllPlaylists } = this.props;

        switch (action) {
            // ===================================  tree reducers
            case 'FETCH_TREE':
                return fetchTree(payload);

            // ===================================   playlist reducers
            case 'FETCH_PLAYLISTS':
                return loadAllPlaylists(payload);
            case 'CREATE_PLAYLIST':
                return createPlaylist({
                    id: -1,
                    title: '...',
                    type: 'playlist',
                    nested: [],
                });
            case 'CREATE_PLAYLIST_SAVE':
                return updateTree(payload);
            case 'DELETE_PLAYLIST':
                return deleteFromTree(payload);
            //  ===================================  songs reducers

            //  ===================================  state
            case 'HANDLE_SWITCH_PLAYLIST':
                return this.setCurrentPlaylist(payload);
            case 'SET_CURRENT':
                if (songsArr[payload]) {
                    if (payload === pointer) {
                        status === 'playing' ? this.pause() : this.play();
                    } else {
                        this.play();
                    }
                    this.setState({ pointer: payload });
                } else {
                    this.pause();
                }
                return;

            case 'SET_STATUS':
                this.setState({ status: payload });
                return;

            // MAIN ACTIONS
            case 'HANDLE_OPEN_MODAL':
                if (current) {
                    Ipc.invoke(
                        'ADD_FILE_DIALOG',
                        files => {
                            console.log(files);
                        },
                        {
                            playlistId: current?.id,
                            playlistTitle: current?.title,
                        }
                    );
                }
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

        return (
            <MainPage
                handleAction={this.handleAction}
                playlists={this.props.playlists}
                tree={tree}
                status={status}
                songs={this.state.songsArr}
                play={this.play}
                current={this.state?.current}
                pointer={pointer}
                waitBetween={waitBetween}
            />
        );
    }
}

const mapStateToProps = ({ playlists, tree }: RootState) => {
    return { playlists, tree };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    loadAllPlaylists: (payload: IPlaylist[]) =>
        dispatch(loadAllPlaylists(payload)),
    fetchTree: (payload: TreeListType[]) => dispatch(fetchTree(payload)),
    createPlaylist: (payload?: TreeListType) =>
        dispatch(createTempPlaylist(payload)),
    updateTree: (payload: TreeListType, extra?: any) =>
        dispatch(updateTreePlaylist(payload, extra)),
    deleteFromTree: (payload: TreeListType) =>
        dispatch(deleteFromTree(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
