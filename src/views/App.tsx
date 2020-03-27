import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ISong, IState } from '@services/db';

import { Logger } from '../logger/logger';
import { TreeListType, StatusType } from './interfaces';
import { AllHandlerActions } from './interfaces';
import {
    RootState,
    fetchTree,
    deleteSong,
    fetchState,
    updateState,
} from './store';
import { savePlaylist, deleteFromTree } from './store';
import { createTempPlaylist, updatePlaylist } from './store';
import { sortPlaylist } from './store';
import { Ipc, setupListeners } from './tools';
import { Randomize, by } from './utils';
import { MainPage } from './pages';

import './app.style.less';

type Props = DispatchProps & StateProps;

export type AppState = {
    time: number;
    pointer: number;
    src: string;
    loading: boolean;
    status: StatusType;
    randomized?: number[];
    source: MediaElementAudioSourceNode | null;
};

export class App extends Component<Props, AppState> {
    player: HTMLMediaElement | null = null;
    randomizer: Randomize | null = null;

    constructor(props: Props) {
        super(props);
    }

    componentDidMount = async () => {
        await setupListeners(this.handleAction, this.player);
        await Ipc.invokeAndHandle('FETCH_TREE', this.handleAction);
        const initialState = await Ipc.invokeAndReturn<IState>(
            'FETCH_STATE',
            this.handleAction
        );

        const src = this.getCurrentSrc();
        this.handleAction('FETCH_REMOTE_STATE', { ...initialState, src });
        this.setState({ loading: false, src });
        this.initPlayer();
    };

    state: AppState = {
        src: '',
        pointer: 0,
        loading: true,
        time: 0,
        status: 'ready',
        randomized: [],
        source: null,
    };

    handleAction = async (
        action: AllHandlerActions,
        payload?: any,
        extra?: any
    ): Promise<void> => {
        const {
            tree,
            fetchTreeDispatch,
            fetchStateDispatch,
            updateStateDispatch,
            createPlaylistDispatch,
            savePlaylistDispatch,
            sortPlaylistDispatch,
            updatePlaylistDispatch,
            deletePlaylistDispatch,
            deleteSongDispatch,
        } = this.props;

        const logger = new Logger('app');

        const { pointer, status } = this.state;
        const [current] = this.getCurrentPlaylist();
        const { current_playlist_id: currentPlaylistId } = this.props.state;

        logger.info(`Action Hander dispatched "${action}"`, [
            payload,
            current,
            extra,
        ]);

        switch (action) {
            case 'OPEN_PREFRENCES':
                return this.handleAction('UPDATE_REMOTE_STATE', {
                    is_prefs_open: !this.props.state.is_prefs_open,
                });

            case 'TOGGLE_SIDEBAR':
                return this.handleAction('UPDATE_REMOTE_STATE', {
                    show_explorer: !this.props.state.show_explorer,
                });
            // return this.setState({
            // showExplorer: !this.state.showExplorer,
            // });

            case 'ACC_PLAY_PAUSE':
                if (status !== 'playing') {
                    return this.play();
                }

                return this.pause();

            case 'ACC_FF':
                return this.forward();

            case 'ACC_REWIND':
                return this.rewind();

            case 'CHANGE_WAIT_BETWEEN':
                if (payload || payload === 0) {
                    await this.handleAction('UPDATE_REMOTE_STATE', {
                        wait_between: parseInt(payload),
                    });
                }

                if (!this.player) {
                    return;
                }

                const parent = this;

                this.player.onended = function() {
                    parent.setState({ status: 'waiting...' });
                    setTimeout(() => {
                        parent.nextsong();
                        parent.setState({ status: 'playing' });
                    }, parent.props.state.wait_between * 1000);
                };

                return;

            case 'SWITCH_PLAYLIST':
                this.pause(true);
                let pathToSong = this.getCurrentSrc(payload);
                await this.handleAction('UPDATE_REMOTE_STATE', {
                    current_playlist_id: payload,
                });
                return this.setState({
                    src: pathToSong,
                    pointer: 0,
                    // currentPlaylistId: payload,
                    status: 'ready',
                });

            // ===================================  TREE reducers   ========================================= //

            case 'FETCH_TREE':
                return fetchTreeDispatch(payload);

            case 'FETCH_REMOTE_STATE':
                return fetchStateDispatch(payload);

            case 'UPDATE_REMOTE_STATE':
                return updateStateDispatch(payload);

            case 'CREATE_PLAYLIST_TEMP':
                if (tree.filter(pl => pl?.id === -1).length) {
                    return;
                }

                if (!this.props.state.show_explorer) {
                    // this.setState({ showExplorer: true });
                    await this.handleAction('UPDATE_REMOTE_STATE', {
                        show_explorer: true,
                    });
                }

                return createPlaylistDispatch({
                    id: -1,
                    title: '...',
                    type: 'playlist',
                    nested: [],
                });

            case 'SAVE_PLAYLIST':
                savePlaylistDispatch(payload, extra);
                await this.handleAction('UPDATE_REMOTE_STATE', {
                    current_playlist_id: payload.id,
                });
                return this.setState({
                    pointer: 0,
                    status: 'ready',
                });

            case 'SORT_PLAYLIST':
                if (!current) {
                    return;
                }
                const sorted = await Ipc.invokeAndReturn<boolean>(
                    'SORT_PLAYLIST',
                    {
                        ...payload,
                        currentPlaylistId,
                    }
                );

                if (!sorted) {
                    return;
                }

                return sortPlaylistDispatch(
                    { ...current, nested: payload.songs },
                    currentPlaylistId
                );

            case 'UPDATE_PLAYLIST':
                return updatePlaylistDispatch(payload);

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

                    if (res.length) {
                        this.setState({ loading: true });
                        if (res.length === 1) {
                            const songs = (current?.nested as ISong[])?.concat({
                                ...res[0],
                                song_index: current?.nested.length + 1,
                            }) as ISong[];
                            const updatedTreeItem = {
                                ...current,
                                nested: songs,
                            };

                            setTimeout(() => {
                                if (!current?.nested.length) {
                                    this.setState({ src: songs[0]?.path });
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
                                        current?.nested.length + 1 + index,
                                }))
                            );

                            const updatedTreeItem = {
                                ...current,
                                nested: songs,
                            };

                            setTimeout(() => {
                                if (!current?.nested.length) {
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

            case 'ADD_SONG_DROP':
                if (!current) {
                    return;
                }
                const initialIndex = current?.nested?.length + 1;
                const droppedReturn = await Ipc.invokeAndReturn<ISong[]>(
                    'DROP_SONG',
                    {
                        paths: payload,
                        playlistId: currentPlaylistId,
                        index: initialIndex,
                    }
                );

                const songsAfterDrop = (current?.nested as ISong[]).concat(
                    droppedReturn.map((song, index) => ({
                        ...song,
                        song_index: index + initialIndex,
                    }))
                );

                const updated = {
                    ...current,
                    nested: songsAfterDrop,
                };

                return savePlaylistDispatch(updated);

            case 'UPDATE_SONG':
                const res = await Ipc.invokeAndReturn<boolean>(
                    'UPDATE_SONG',
                    payload
                );

                const songsAfterUpdate = (current?.nested as ISong[]).map(
                    song => {
                        if (song.id === payload.id) {
                            return payload as ISong;
                        }
                        return song;
                    }
                );

                if (!res) {
                    return;
                }

                return updatePlaylistDispatch({
                    ...tree.filter(
                        item =>
                            item.type === 'playlist' && item.id === current?.id
                    )[0],
                    nested: songsAfterUpdate,
                });

            case 'DELETE_SONG':
                await Ipc.invokeAndReturn('DELETE_SONG', payload);

                if (!current) {
                    return;
                }

                const songsAfterDelete = (current?.nested as ISong[])?.filter(
                    song => song.id !== payload[0].id
                );

                const updatedTreeItem = {
                    ...tree.filter(
                        item =>
                            item.type === 'playlist' && item.id === current?.id
                    )[0],
                    nested: songsAfterDelete || [],
                };

                return deleteSongDispatch(updatedTreeItem);

            case 'CHANGE_SONG':
                const songsArr = current?.nested || [];
                const pathTo = (songsArr[payload.pointer] as ISong)?.path;

                if (pathTo === this.state.src && payload.pointer !== pointer) {
                    this.setCurrentTime(0);
                }

                if (songsArr.length) {
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

                return this.setState({ src: pathTo, pointer: payload.pointer });

            // case 'SET_STATUS':
            //     console.log('setStatus');
            //     // return this.setState({ status: payload });
            //     return;

            case 'SET_VOLUME':
                if (!this.player) {
                    return;
                }

                if (payload < 0) {
                    this.player.volume = 0;

                    return this.handleAction('UPDATE_REMOTE_STATE', {
                        volume: 0,
                    });
                }

                if (payload > 1) {
                    this.player.volume = 1;

                    return this.handleAction('UPDATE_REMOTE_STATE', {
                        volume: 1,
                    });
                }

                this.player.volume = payload;

                return this.handleAction('UPDATE_REMOTE_STATE', {
                    volume: payload,
                });

            case 'SET_STATE':
                return this.setState(payload);

            default:
                console.log(
                    `unknown action: ${action}, with payload: ${payload}`
                );
                break;
        }
    };

    initPlayer = () => {
        if (!this.player) {
            return;
        }
        const volume = this.props.state.volume || 0.5;
        this.player.src = this.state.src;
        this.player.volume = volume;

        this.handleAction('CHANGE_WAIT_BETWEEN');
        this.handleAction('SET_VOLUME', volume);
    };

    getCurrentPlaylist = (id?: number): TreeListType[] | undefined[] =>
        this.props.tree.filter(
            item =>
                item.type === 'playlist' &&
                item?.id === (id || this.props.state.current_playlist_id)
        );

    getCurrentSrc = (id?: number): string => {
        const [song] =
            (this.getCurrentPlaylist(id)[0]?.nested as ISong[])?.sort((a, b) =>
                by(a, b, 'song_index')
            ) || [];

        let pathToSong = '';

        if (song) {
            pathToSong = song.path;
        }

        return pathToSong;
    };

    play = async (): Promise<void> => {
        if (!this.player) {
            return;
        }

        this.setState({ status: 'playing' });
        this.player.play();
        return;
    };

    pause = (stop?: boolean): void => {
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

    nextsong = async (): Promise<void> => {
        if (!this.player) {
            return;
        }
        const [current] = this.getCurrentPlaylist();

        const nested = (current?.nested || []) as ISong[];
        if (this.state.pointer + 1 === nested.length) {
            this.setState({
                src: nested[0]?.path,
                pointer: 0,
                status: 'done',
                time: 0,
            });

            setTimeout(() => {
                this.setState({ status: 'ready' });
                this.props.state.loop && this.play();
            }, 1000);

            return;
        }

        const randomizer = new Randomize(current?.nested.length || 1);
        if (!this.state.randomized?.length) {
            const newArr = await randomizer.randomizarray();
            this.setState({ randomized: newArr });
        }

        const afterFilter = this.state.randomized?.filter(item => {
            return item !== this.state.randomized?.[0];
        });

        const newPointer = this.props.state.random
            ? this.state.randomized?.[0]
            : this.state.pointer + 1;

        this.handleAction('CHANGE_SONG', {
            pointer: newPointer,
        });

        this.handleAction('SET_STATE', {
            pointer: newPointer,
        });

        this.setState({ randomized: afterFilter });
    };

    lastsong = (): void => {
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

    rewind = (): void => {
        if (!this.player) {
            return;
        }

        return this.setCurrentTime(
            this.player.currentTime < 5 ? 0 : this.player.currentTime - 5
        );
    };

    forward = (): void => {
        if (!this.player) {
            return;
        }

        return this.setCurrentTime(this.player.currentTime + 5);
    };

    getCurrentTime = (): number => {
        return this.player?.currentTime || 0;
    };

    setCurrentTime = (time: number): void => {
        this.setState({ time });
        if (this.player) {
            this.player.currentTime = time;
        }
    };

    addSongModal = (): Promise<void> => this.handleAction('ADD_SONG_MODAL');

    render() {
        const { tree } = this.props;
        const { status, pointer, loading } = this.state;

        const {
            wait_between: waitBetween,
            show_explorer: showExplorer,
            random,
            loop,
            is_prefs_open: isPrefsOpen,
            current_playlist_id: currentPlaylistId,
        } = this.props.state;

        const [current] = this.getCurrentPlaylist();

        return (
            <>
                <audio ref={el => (this.player = el)} src={this.state.src} />
                <MainPage
                    showExplorer={showExplorer}
                    isPrefsOpen={isPrefsOpen}
                    current={current}
                    loading={loading}
                    loop={loop}
                    random={random}
                    currentPlaylistId={currentPlaylistId}
                    tree={tree}
                    status={status}
                    pointer={pointer}
                    waitBetween={waitBetween}
                    pause={this.pause}
                    play={this.play}
                    nextsong={this.nextsong}
                    lastsong={this.lastsong}
                    rewind={this.rewind}
                    forward={this.forward}
                    getCurrentTime={this.getCurrentTime}
                    setCurrentTime={this.setCurrentTime}
                    addSongModal={this.addSongModal}
                    handleAction={this.handleAction}
                    player={this.player}
                    context={this.context}
                    source={this.state.source}
                />
            </>
        );
    }
}

type StateProps = {
    tree: TreeListType[];
    state: IState;
};

const mapStateToProps = ({ tree, state }: RootState) => {
    return { tree, state };
};

type DispatchProps = {
    fetchTreeDispatch: (payload: TreeListType[]) => void;
    fetchStateDispatch: (payload: IState) => void;
    updateStateDispatch: (payload: IState) => void;
    createPlaylistDispatch: (payload?: TreeListType) => void;
    savePlaylistDispatch: (payload: TreeListType, extra?: any) => void;
    deletePlaylistDispatch: (payload: TreeListType) => void;
    deleteSongDispatch: (payload: TreeListType) => void;
    updatePlaylistDispatch: (payload: TreeListType) => void;
    sortPlaylistDispatch: (payload: TreeListType, extra: number) => void;
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
    sortPlaylistDispatch: (payload: TreeListType) =>
        dispatch(sortPlaylist(payload)),

    fetchStateDispatch: (payload: IState) => dispatch(fetchState(payload)),
    updateStateDispatch: (payload: Partial<IState>) =>
        dispatch(updateState(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
