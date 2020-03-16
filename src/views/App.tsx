import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ISong } from '@services/db';

import { TreeListType, HandlerAction, StateHandlerAction } from './interfaces';
import { RootState, fetchTree, deleteSong } from './store';
import { savePlaylist, deleteFromTree } from './store';
import { createTempPlaylist, updatePlaylist } from './store';
import { Ipc } from './tools';
import { Randomize } from './utils';
import { MainPage } from './pages';
import { Logger } from '../logger/logger';

import './app.style.less';
import { createAnalyser } from './analyser';

type Status = 'ready' | 'playing' | 'paused' | 'stopped' | 'done' | 'loading';

type Props = DispatchProps & StateProps;

type State = {
    currentPlaylistId: number;
    pointer: number;
    time: number;
    src: string;
    waitBetween: number;
    status: Status;
    loading: boolean;
    loop: boolean;
    random: boolean;
    randomized?: number[];
};

export class App extends Component<Props, State> {
    player: HTMLAudioElement | null = null;
    randomizer: Randomize | null = null;
    canvas: HTMLCanvasElement | null = null;

    constructor(props: Props) {
        super(props);
    }

    componentDidMount = async () => {
        this.canvas = document.getElementById(
            'analyser_render'
        ) as HTMLCanvasElement;
        if (this.player && this.canvas) {
            const parent = this;
            createAnalyser(parent, this.canvas, this.player);
            this.player.volume = 0.5;
            this.player.onended = function() {
                parent.nextsong();
            };
        }

        await Ipc.invokeAndHandle('FETCH_TREE', this.handleAction);

        const songs = this.props.tree.filter(
            item => item.type === 'playlist'
        )?.[0]?.nested as ISong[];

        const [src] = !songs
            ? []
            : songs
                  ?.filter(
                      song => (song.song_index || 0) - 1 === this.state.pointer
                  )
                  .map(song => song.path);

        const randomizer = new Randomize(
            this.props.tree.filter(item => item.type === 'playlist')[0].nested
                .length || 0
        );

        this.setState({
            randomized: await randomizer.randomizarray(),
            src,
            loading: false,
            currentPlaylistId:
                this.props.tree.filter(item => item.type === 'playlist')[0]
                    ?.id || 1,
        });
    };

    state: State = {
        currentPlaylistId:
            this.props.tree.filter(item => item.type === 'playlist')[0]?.id ||
            1,
        pointer: 0,
        src: '',
        waitBetween: 0,
        time: 0,
        status: 'ready',
        loading: true,
        loop: true,
        random: false,
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
                let pathToSong = this.getCurrentSrc(payload);
                return this.setState({
                    src: pathToSong,
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
                        }, 80);
                        return;
                    } else {
                        setTimeout(() => {
                            this.play();
                        }, 20);
                    }
                }

                // update state anyway
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
                let check = true;
                if (!payload.temp) {
                    check = await Ipc.invokeAndReturn(
                        'DELETE_PLAYLIST',
                        payload.playlist.id
                    );
                }
                if (!check) {
                    return;
                }
                return deletePlaylistDispatch(payload.playlist);

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
                    if (res) {
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
                                if (!current.nested.length) {
                                    this.setState({ src: songs[0].path });
                                }
                                this.setState({ loading: false });
                                savePlaylistDispatch(updatedTreeItem);
                            }, 1000);

                            return;
                        }

                        if (res.length > 1) {
                            const songs = (current?.nested as ISong[])?.concat(
                                res.map((song, index) => ({
                                    ...song,
                                    song_index:
                                        current.nested.length + 1 + index,
                                }))
                            );

                            const updatedTreeItem = {
                                ...oldTreeItem,
                                nested: songs,
                            };

                            setTimeout(() => {
                                if (!current.nested.length) {
                                    this.setState({ src: songs[0].path });
                                }
                                this.setState({ loading: false });
                                savePlaylistDispatch(updatedTreeItem);
                            }, 1000);
                            return;
                        }
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

            case 'SET_STATE':
                return this.setState(payload);
            default:
                console.log(
                    `unknown action: ${action}, with payload: ${payload}`
                );
                break;
        }
    };

    handleAnalyse = () => {
        if (this.canvas && this.player) {
            createAnalyser(parent, this.canvas, this.player);
        }
    };

    getPlayer = () => {
        return this.player;
    };

    getCurrentList = (id?: number) =>
        this.props.tree.filter(
            item =>
                item.type === 'playlist' &&
                item?.id === (id || this.state.currentPlaylistId)
        );

    getCurrentSrc = (id?: number) => {
        const [list] = this.getCurrentList(id);
        let pathToSong = '';
        if (list.nested.length) {
            pathToSong = (list.nested[0] as ISong).path;
        }

        return pathToSong;
    };

    play = async () => {
        if (!this.player) {
            return;
        }

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
            this.setState({
                status: 'done',
                time: 0,
                pointer: 0,
                src: (current.nested[0] as ISong).path,
            });

            setTimeout(() => {
                this.setState({ status: 'ready' });
                this.state.loop && this.play();
            }, 1000);

            return;
        }

        const randomizer = new Randomize(current.nested.length);
        if (!this.state.randomized?.length) {
            const newArr = await randomizer.randomizarray();
            this.setState({ randomized: newArr });
        }

        const afterFilter = this.state.randomized?.filter(item => {
            return item !== this.state.randomized?.[0];
        });

        this.handleAction('CHANGE_SONG', {
            pointer: this.state.random
                ? this.state.randomized?.[0]
                : this.state.pointer + 1,
        });

        this.setState({ randomized: afterFilter });
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
            random,
            loop,
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
                    handleAnalyse={this.handleAnalyse}
                    pause={this.pause}
                    play={this.play}
                    nextsong={this.nextsong}
                    lastsong={this.lastsong}
                    rewind={this.rewind}
                    forward={this.forward}
                    getCurrentTime={this.getCurrentTime}
                    setCurrentTime={this.setCurrentTime}
                    addSongModal={this.addSongModal}
                    getPlayer={this.getPlayer}
                    handleAction={this.handleAction}
                    loading={loading}
                    loop={loop}
                    random={random}
                    currentPlaylistId={currentPlaylistId}
                    tree={tree}
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
