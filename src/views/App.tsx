import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { TreeListType, HandlerAction } from './interfaces';
import { loadAllPlaylists, RootState, fetchTree } from './store';
import { updateTreePlaylist, deleteFromTree } from './store';
import { createTempPlaylist } from './store';

import { IPlaylist } from '@services/db';
import { Ipc } from './tools';

import { MainPage } from './pages';

import './App.style.less';
import { Logger } from '../logger/logger';

const logger = new Logger('app');

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
};

export class App extends Component<Props, State> {
    componentDidMount = async () => {
        await Ipc.invoke('FETCH_TREE', this.handleAction);
        await Ipc.invoke('FETCH_PLAYLISTS', this.handleAction);

        const [playlist] = this.props.playlists;
        this.setCurrentPlaylist(playlist?.id || -1);
    };

    state: State = {
        theme: 'dark',
        currentPlaylistId: 2,
        pointer: 0,
        waitBetween: 0.5,
        status: 'stoped',
    };

    handleAction = async (
        action: HandlerAction,
        payload?: any,
        extra?: any
    ) => {
        const { pointer, status, current } = this.state;
        const { fetchTree, updateTree, tree } = this.props;
        const { createPlaylist, deleteFromTree, loadAllPlaylists } = this.props;

        logger.info(`Action Hander dispatched "${action}"`, [payload, extra]);

        switch (action) {
            // ===================================  TREE reducers   ========================================= //
            case 'FETCH_TREE':
                return fetchTree(payload);

            // ===================================   PLAYLIST reducers   ========================================= //
            case 'FETCH_PLAYLISTS':
                return loadAllPlaylists(payload);

            case 'CREATE_TEMP_PLAYLIST':
                if (tree.filter(pl => pl?.id === -1).length) {
                    return;
                }

                return createPlaylist({
                    id: -1,
                    title: '...',
                    type: 'playlist',
                    nested: [],
                });

            case 'CREATE_PLAYLIST_SAVE':
                const x = await Ipc.invokeAndReturn<IPlaylist[]>(
                    'FETCH_PLAYLISTS'
                );
                this.props.loadAllPlaylists(x);
                this.setState({ currentPlaylistId: payload.id });
                this.setCurrentPlaylist(payload.id);
                return updateTree(payload, extra);

            case 'DELETE_PLAYLIST':
                return deleteFromTree(payload);
            //  ===================================  SONG reducers   ========================================= //

            //  ===================================  STATE   ========================================= //
            case 'HANDLE_SWITCH_PLAYLIST':
                return this.setCurrentPlaylist(payload);

            case 'SET_CURRENT':
                if (current?.songs?.[payload]) {
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
                            index: (current?.songs?.length || 0) + 1,
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

    setCurrentPlaylist = (payload: number) => {
        const [current] = this.props.playlists?.filter(
            pl => pl.id && pl.id === payload
        );

        if (current) {
            this.setState({
                ...this.state,
                pointer: 0,
                status: 'ready',
                current,
                currentPlaylistId: payload,
            });
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
        const {
            pointer,
            waitBetween,
            status,
            current,
            currentPlaylistId,
        } = this.state;

        return (
            <MainPage
                getPlayer={this.getPlayer}
                handleAction={this.handleAction}
                playlists={playlists}
                tree={tree}
                status={status}
                play={this.play}
                current={current}
                pointer={pointer}
                waitBetween={waitBetween}
                currentPlaylistId={currentPlaylistId}
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
