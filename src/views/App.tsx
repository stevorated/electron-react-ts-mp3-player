import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { TreeListType, HandlerAction, StateHandlerAction } from './interfaces';
import { RootState, fetchTree, deleteSong } from './store';
import { savePlaylist, deleteFromTree } from './store';
import { createTempPlaylist, updatePlaylist } from './store';

import { IPlaylist, ISong } from '@services/db';
import { Ipc } from './tools';

import { MainPage } from './pages';

import './App.style.less';
import { Logger } from '../logger/logger';

type ComponentProps = {
    theme?: string;
};

type Props = ComponentProps & DispatchProps & StateProps;

type State = {
    theme: string;
    currentPlaylistId: number;
    pointer: number;
    waitBetween: number;
    current?: IPlaylist;
    status: string;
    loading: boolean;
};

export class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount = async () => {
        await Ipc.invokeAndHandle('FETCH_TREE', this.handleAction);
    };

    state: State = {
        theme: 'dark',
        currentPlaylistId:
            this.props.tree.filter(item => item.type === 'playlist')[0]?.id ||
            1,
        pointer: 0,
        waitBetween: 0.5,
        status: 'stoped',
        loading: false,
    };

    handleAction = async (
        action: HandlerAction | StateHandlerAction,
        payload?: any,
        extra?: any
    ) => {
        const { pointer, status, currentPlaylistId } = this.state;
        const {
            tree,
            fetchTreeDispatch,
            createPlaylistDispatch,
            savePlaylistDispatch,
            updatePlaylistDispatch,
            deletePlaylistDispatch,
            deleteSongDispatch,
        } = this.props;

        const logger = new Logger('app');

        const [current] = tree.filter(
            item => item.type === 'playlist' && item?.id === currentPlaylistId
        );

        const player = this.getPlayer();
        logger.info(`Action Hander dispatched "${action}"`, [payload, extra]);

        switch (action) {
            case 'SWITCH_PLAYLIST':
                return this.setState({
                    pointer: 0,
                    status: 'ready',
                    currentPlaylistId: payload,
                });

            case 'CHANGE_SONG':
                if (current?.nested?.length) {
                    if (current.nested[payload]) {
                        if (payload === pointer) {
                            status === 'playing' ? this.pause() : this.play();
                        } else {
                            this.play();
                        }
                        this.setState({ pointer: payload });
                    } else {
                        this.pause();
                    }
                }
                return;

            case 'NEXT_SONG':
                if (!player || !current) {
                    return;
                }
                if (current.nested.length) {
                    if (current.nested[payload]) {
                        this.setState({
                            pointer: pointer + 1,
                        });
                        if (status === 'playing') {
                            setTimeout(() => {
                                player.play();
                            }, 50);
                        }
                    }
                }
                return;

            case 'BACK_SONG':
                if (!player || !current) {
                    return;
                }
                if (current.nested.length) {
                    const wait = 2;

                    if (player.currentTime > wait || payload === -1) {
                        player.currentTime = 0;
                        return;
                    }

                    if (current.nested[payload]) {
                        if (player.currentTime < wait) {
                            this.setState({
                                pointer: pointer - 1,
                            });
                            if (status === 'playing') {
                                setTimeout(() => {
                                    player.play();
                                }, 50);
                            }
                        }
                    }
                }
                return;

            case 'SET_STATUS':
                this.setState({ status: payload });
                return;

            // ===================================  TREE reducers   ========================================= //

            case 'FETCH_TREE':
                return fetchTreeDispatch(payload);

            case 'CREATE_PLAYLIST_TEMP':
                if (tree.filter(pl => pl?.id === -1).length) {
                    return;
                }

                return createPlaylistDispatch({
                    id: -1,
                    title: '...',
                    type: 'playlist',
                    nested: [],
                });

            case 'SAVE_PLAYLIST':
                savePlaylistDispatch(payload, extra);

                this.setState({
                    currentPlaylistId: payload.id,
                    pointer: 0,
                    status: 'ready',
                });

                return;

            case 'UPDATE_PLAYLIST':
                updatePlaylistDispatch(payload);
                return;
            case 'DELETE_PLAYLIST':
                return deletePlaylistDispatch(payload);

            case 'ADD_SONG_MODAL':
                if (current) {
                    const res = await Ipc.invokeAndReturn<ISong[]>(
                        'ADD_SONG',

                        {
                            playlistId: current?.id,
                            index: (current?.nested?.length || 0) + 1,
                        }
                    );

                    const [oldTreeItem] = tree.filter(
                        item =>
                            item.type === 'playlist' && item.id === current.id
                    );
                    this.setState({ loading: true });
                    // let songs: ISong[];
                    if (res.length === 1) {
                        const songs = (current?.nested as ISong[])?.concat({
                            ...res[0],
                            song_index: current.nested.length + 1,
                        }) as ISong[];
                        const updatedTreeItem = {
                            ...oldTreeItem,
                            nested: songs,
                        };

                        setTimeout(() => {
                            this.setState({ loading: false });
                            savePlaylistDispatch(updatedTreeItem);
                        }, 1000);

                        return;
                    }

                    if (res.length > 1) {
                        console.log(res);
                        const songs = (current?.nested as ISong[])?.concat(
                            res.map((song, index) => ({
                                ...song,
                                song_index: current.nested.length + 1 + index,
                            }))
                        );

                        const updatedTreeItem = {
                            ...oldTreeItem,
                            nested: songs,
                        };

                        setTimeout(() => {
                            this.setState({ loading: false });
                            savePlaylistDispatch(updatedTreeItem);
                        }, 1000);
                        return;
                    }
                }

                return;
            case 'UPDATE_SONG':
                const res = await Ipc.invokeAndReturn<ISong[]>(
                    'UPDATE_SONG',
                    payload
                );
                const songsAfterUpdate = (current?.nested as ISong[]).map(
                    song => {
                        if (song.id === payload.id) {
                            return payload;
                        }
                        return song;
                    }
                );

                if (res) {
                    updatePlaylistDispatch({
                        ...tree.filter(
                            item =>
                                item.type === 'playlist' &&
                                item.id === current.id
                        )[0],
                        nested: songsAfterUpdate,
                    });
                }
                return;
            case 'DELETE_SONG':
                Ipc.invokeAndReturn('DELETE_SONG', payload);
                if (!current) {
                    return;
                }

                const songs = (current.nested as ISong[])?.filter(
                    song => song.id !== payload[0].id
                );

                const updatedTreeItem = {
                    ...tree.filter(
                        item =>
                            item.type === 'playlist' && item.id === current.id
                    )[0],
                    nested: songs || [],
                };

                return deleteSongDispatch(updatedTreeItem);
            default:
                console.log(
                    `unknown action: ${action}, with payload: ${payload}`
                );
                break;
        }
    };

    getPlayer = () =>
        document?.getElementById('media-player') as HTMLMediaElement;

    play = () => {
        const { waitBetween } = this.state;
        const player = this.getPlayer();
        this.setState({ status: 'playing' });
        setTimeout(() => {
            player.currentTime = 0;
            player.play();
        }, waitBetween * 1000);
    };

    pause = () => {
        const player = this.getPlayer();
        this.setState({ status: 'paused' });
        player.pause();
    };

    render() {
        const { tree } = this.props;
        const {
            status,
            waitBetween,
            pointer,
            currentPlaylistId,
            loading,
        } = this.state;

        return (
            <MainPage
                loading={loading}
                currentPlaylistId={currentPlaylistId}
                tree={tree}
                getPlayer={this.getPlayer}
                handleAction={this.handleAction}
                status={status}
                play={this.play}
                pointer={pointer}
                waitBetween={waitBetween}
            />
        );
    }
}

type StateProps = {
    tree: TreeListType[];
};

const mapStateToProps = ({ tree }: RootState) => {
    return { tree };
};

type DispatchProps = {
    fetchTreeDispatch: (payload: TreeListType[]) => void;
    createPlaylistDispatch: (payload?: TreeListType) => void;
    savePlaylistDispatch: (payload: TreeListType, extra?: any) => void;
    deletePlaylistDispatch: (payload: TreeListType) => void;
    deleteSongDispatch: (payload: TreeListType) => void;
    updatePlaylistDispatch: (payload: TreeListType) => void;
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    fetchTreeDispatch: (payload: TreeListType[]) =>
        dispatch(fetchTree(payload)),
    createPlaylistDispatch: (payload?: TreeListType) =>
        dispatch(createTempPlaylist(payload)),
    savePlaylistDispatch: (payload: TreeListType, extra?: any) =>
        dispatch(savePlaylist(payload, extra)),
    deletePlaylistDispatch: (payload: TreeListType) =>
        dispatch(deleteFromTree(payload)),
    deleteSongDispatch: (payload: TreeListType) =>
        dispatch(deleteSong(payload)),
    updatePlaylistDispatch: (payload: TreeListType) =>
        dispatch(updatePlaylist(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
