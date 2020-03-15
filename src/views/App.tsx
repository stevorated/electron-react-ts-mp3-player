import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ISong } from '@services/db';

import { TreeListType, HandlerAction, StateHandlerAction } from './interfaces';
import { RootState, fetchTree, deleteSong } from './store';
import { savePlaylist, deleteFromTree } from './store';
import { createTempPlaylist, updatePlaylist } from './store';
import { Ipc } from './tools';
import { MainPage } from './pages';
import { Logger } from '../logger/logger';
import { AudioSample } from './utils';
import './layout.style.less';

type Status = 'ready' | 'playing' | 'paused' | 'stopped' | 'done';

type Props = DispatchProps & StateProps;

type State = {
    currentPlaylistId: number;
    pointer: number;
    time: number;
    src: string;
    waitBetween: number;
    status: Status;
    loading: boolean;
    track?: AudioSample;
};

export class App extends Component<Props, State> {
    player: HTMLAudioElement | null = null;

    constructor(props: Props) {
        super(props);
    }

    componentDidMount = async () => {
        if (this.player) {
            const parent = this;
            this.player.onended = function() {
                parent.nextsong();
            };
        }
        await Ipc.invokeAndHandle('FETCH_TREE', this.handleAction);
        const [current] = this.getCurrentList();
        const src = (current.nested[this.state.pointer] as ISong).path;
        this.setState({ src });
    };

    // componentDidUpdate = () => {

    // if (current && src !== this.state.src) {
    //     const track = new AudioSample(src);
    // }
    // };

    state: State = {
        currentPlaylistId:
            this.props.tree.filter(item => item.type === 'playlist')[0]?.id ||
            1,
        pointer: 0,
        src: '',
        waitBetween: 0,
        time: 0,
        status: 'stopped',
        loading: false,
    };

    handleAction = async (
        action: HandlerAction | StateHandlerAction,
        payload?: any,
        extra?: any
    ) => {
        const { currentPlaylistId, pointer } = this.state;
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

        logger.info(`Action Hander dispatched "${action}"`, [payload, extra]);

        switch (action) {
            case 'SWITCH_PLAYLIST':
                this.pause(true);
                return this.setState({
                    pointer: 0,
                    status: 'ready',
                    currentPlaylistId: payload,
                });

            case 'CHANGE_SONG':
                const songsArr = current.nested;
                const src = (songsArr[payload.pointer] as ISong).path;
                if (src === this.state.src && payload.pointer !== pointer) {
                    this.setCurrentTime(0);
                }

                if (songsArr.length) {
                    // click on same song
                    if (payload.click && pointer === payload.pointer) {
                        setTimeout(() => {
                            this.state.status === 'playing'
                                ? this.pause()
                                : this.play();
                        }, 20);
                        return;
                    } else {
                        setTimeout(() => {
                            this.play();
                        }, 20);
                    }
                }
                this.setState({ src, pointer: payload.pointer });
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

                const songsAfterDelete = (current.nested as ISong[])?.filter(
                    song => song.id !== payload[0].id
                );

                const updatedTreeItem = {
                    ...tree.filter(
                        item =>
                            item.type === 'playlist' && item.id === current.id
                    )[0],
                    nested: songsAfterDelete || [],
                };

                return deleteSongDispatch(updatedTreeItem);

            default:
                console.log(
                    `unknown action: ${action}, with payload: ${payload}`
                );
                break;
        }
    };

    getPlayer = () => {
        return this.player;
    };

    getCurrentList = () =>
        this.props.tree.filter(
            item =>
                item.type === 'playlist' &&
                item?.id === this.state.currentPlaylistId
        );

    play = async () => {
        if (!this.player) {
            return;
        }
        console.log('play');
        this.setState({ status: 'playing' });
        this.player.play();
        return;
    };

    pause = (stop?: boolean) => {
        if (!this.player) {
            return;
        }

        if (stop) {
            this.player.pause();
            this.player.currentTime = 0;
            return this.setState({ status: 'stopped', time: 0 });
        }

        this.player.pause();
        return this.setState({ status: 'paused' });
    };

    nextsong = async () => {
        if (!this.player) {
            return;
        }
        const [current] = this.getCurrentList();

        if (this.state.pointer + 1 === current.nested.length) {
            this.pause(true);
            this.setState({ status: 'done', time: 0, pointer: 0 });
            return;
        }

        this.handleAction('CHANGE_SONG', {
            pointer: this.state.pointer + 1,
        });
    };

    lastsong = () => {
        if (!this.player) {
            return;
        }

        if (this.player.currentTime > 3) {
            this.player.currentTime = 0;

            return;
        }

        if (this.state.pointer > 0) {
            this.handleAction('CHANGE_SONG', {
                pointer: this.state.pointer - 1,
            });

            return;
        }
    };

    rewind = () => {
        if (!this.player) {
            return;
        }

        this.setCurrentTime(
            this.player.currentTime < 5 ? 0 : this.player.currentTime - 5
        );
    };

    forward = () => {
        if (!this.player) {
            return;
        }

        this.setCurrentTime(this.player.currentTime + 5);
    };

    getCurrentTime = () => {
        return this.player?.currentTime || 0;
    };

    setCurrentTime = (time: number) => {
        this.setState({ time });
        if (this.player) {
            this.player.currentTime = time;
        }
    };

    addSongModal = () => {
        this.handleAction('ADD_SONG_MODAL');
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
            <>
                <audio ref={el => (this.player = el)} src={this.state.src} />
                <MainPage
                    pause={this.pause}
                    play={this.play}
                    nextsong={this.nextsong}
                    lastsong={this.lastsong}
                    rewind={this.rewind}
                    forward={this.forward}
                    getCurrentTime={this.getCurrentTime}
                    setCurrentTime={this.setCurrentTime}
                    addSongModal={this.addSongModal}
                    loading={loading}
                    currentPlaylistId={currentPlaylistId}
                    tree={tree}
                    getPlayer={this.getPlayer}
                    handleAction={this.handleAction}
                    status={status}
                    pointer={pointer}
                    waitBetween={waitBetween}
                />
            </>
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
