import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ISong, IState } from '@services/db';

import { Logger } from '../logger/logger';
import { TreeListType, DispatchProps } from './interfaces';
import { StateProps, AppState, AllHandlerActions } from './interfaces';
import { RootState, fetchTree, deleteSong, fetchState, updateState, sortPlaylist } from './store';
import { savePlaylist, deleteFromTree, createTempPlaylist, updatePlaylist } from './store';
import { Ipc, setupListeners } from './tools';
import { Randomize, by } from './utils';
import { MainPage } from './pages';
import { AudioHandler } from './components/middle/partials/songsList/audioHandler';

import './app.style.less';

type Props = DispatchProps &
    StateProps & {
        sinewaveC: React.RefObject<HTMLCanvasElement>;
        frequencyC: React.RefObject<HTMLCanvasElement>;
        audioHandler: AudioHandler;
        handleLoadFiles: (files: string[]) => Promise<void>;
    };

export class App extends Component<Props, AppState> {
    player: HTMLMediaElement | null = null;
    randomizer: Randomize | null = null;

    componentDidMount = async () => {
        await setupListeners(this.handleAction, this.player);
        await Ipc.invokeAndHandle('FETCH_TREE', this.handleAction);
        await Ipc.invokeAndHandle('FETCH_STATE', this.handleAction, {}, 'FETCH_REMOTE_STATE');

        const [current] = this.getCurrentPlaylist();
        const paths = (current?.nested as ISong[]).sort((a, b) => by(a, b, 'song_index')).map(({ path }) => path);

        await this.props.handleLoadFiles(paths);

        const src = this.getCurrentSrc();

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

    handleAction = async (action: AllHandlerActions, payload?: any, extra?: any): Promise<void> => {
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

        logger.info(`Action Hander dispatched "${action}"`, [payload, current, extra]);

        switch (action) {
            case 'OPEN_PREFRENCES':
                return this.handleAction('UPDATE_REMOTE_STATE', {
                    is_prefs_open: !this.props.state.is_prefs_open,
                });

            case 'TOGGLE_SIDEBAR':
                return this.handleAction('UPDATE_REMOTE_STATE', {
                    show_explorer: !this.props.state.show_explorer,
                });

            case 'ACC_PLAY_PAUSE':
                if (status !== 'playing') {
                    return this.play();
                }

                return this.pause();

            case 'ACC_FF':
                // this.setState({ time: this.state.time + 5 });
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
                        parent.setState({ status: 'playing' });
                        parent.nextsong();
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
                    status: 'ready',
                });

            case 'FETCH_TREE':
                return fetchTreeDispatch(payload);

            case 'FETCH_REMOTE_STATE':
                return fetchStateDispatch(payload);

            case 'UPDATE_REMOTE_STATE':
                await Ipc.invokeAndReturn('UPDATE_STATE', payload);

                return updateStateDispatch(payload);

            case 'CREATE_PLAYLIST_TEMP':
                if (tree.filter(pl => pl?.id === -1).length) {
                    return;
                }

                if (!this.props.state.show_explorer) {
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
                const sorted = await Ipc.invokeAndReturn<boolean>('SORT_PLAYLIST', {
                    ...payload,
                    currentPlaylistId,
                });

                if (!sorted) {
                    return;
                }

                return sortPlaylistDispatch({ ...current, nested: payload.songs }, currentPlaylistId);

            case 'UPDATE_PLAYLIST':
                return updatePlaylistDispatch(payload);

            case 'DELETE_PLAYLIST':
                let check = true;

                if (!payload.temp) {
                    check = await Ipc.invokeAndReturn('DELETE_PLAYLIST', payload.playlist.id);
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
                                    song_index: current?.nested.length + 1 + index,
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
                const droppedReturn = await Ipc.invokeAndReturn<ISong[]>('DROP_SONG', {
                    paths: payload,
                    playlistId: currentPlaylistId,
                    index: initialIndex,
                });

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

                this.setState({ src: songsAfterDrop[0].path });

                return savePlaylistDispatch(updated);

            case 'UPDATE_SONG':
                const res = await Ipc.invokeAndReturn<boolean>('UPDATE_SONG', payload);

                const songsAfterUpdate = (current?.nested as ISong[]).map(song => {
                    if (song.id === payload.id) {
                        return payload as ISong;
                    }
                    return song;
                });

                if (!res) {
                    return;
                }

                return updatePlaylistDispatch({
                    ...tree.filter(item => item.type === 'playlist' && item.id === current?.id)[0],
                    nested: songsAfterUpdate,
                });

            case 'DELETE_SONG':
                await Ipc.invokeAndReturn('DELETE_SONG', payload);

                if (!current) {
                    return;
                }

                const songsAfterDelete = (current?.nested as ISong[])?.filter(song => song.id !== payload[0].id);

                const updatedTreeItem = {
                    ...tree.filter(item => item.type === 'playlist' && item.id === current?.id)[0],
                    nested: songsAfterDelete || [],
                };

                return deleteSongDispatch(updatedTreeItem);

            case 'CHANGE_SONG':
                const songsArr = (current?.nested || []) as ISong[];
                const pathTo = songsArr[payload.pointer]?.path;
                this.props.audioHandler.pause();
                this.props.audioHandler.setPosition(0);
                this.props.audioHandler.jump(payload.pointer - 1);
                if (pathTo === this.state.src && payload.pointer !== pointer) {
                    this.setCurrentTime(0);
                }

                if (songsArr.length) {
                    if (payload.click && pointer === payload.pointer) {
                        setTimeout(async () => {
                            // this.props.audioHandler.jump(this.state.pointer);
                            status === 'playing' ? this.pause() : await this.play();
                        }, 80);

                        return;
                    } else {
                        setTimeout(async () => {
                            // this.props.audioHandler.jump(this.state.pointer);
                            // this.props.audioHandler.jump(this.state.pointer - 1);
                            status === 'playing' && (await this.play());
                        }, 80);
                    }
                }

                return this.setState({ src: pathTo, pointer: payload.pointer });

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
                console.log(`unknown action: ${action}, with payload: ${payload}`);
                break;
        }
    };

    initPlayer = () => {
        const { audioHandler } = this.props;
        const volume = this.props.state.volume || 0.5;

        audioHandler.setVolume(volume);

        this.handleAction('CHANGE_WAIT_BETWEEN');
        this.handleAction('SET_VOLUME', volume);

        const onCleanCartridge = () => {
            this.setCurrentTime(0);
        };

        const onSongEnd = () => {
            audioHandler.getStatus() === 'PLAY' && this.nextsong();

            this.setCurrentTime(audioHandler.getDuration());
        };

        window.addEventListener('onsongend', onSongEnd);
        window.addEventListener('cleancartridge', onCleanCartridge);

        // return () => {
        //     window.removeEventListener('cleancartridge', onCleanCartridge);
        //     window.removeEventListener('onsongend', onSongEnd);
        //     window.removeEventListener('changeposition', onChangeSong);
        // };
    };

    getCurrentPlaylist = (id?: number): TreeListType[] | undefined[] =>
        this.props.tree.filter(
            item => item.type === 'playlist' && item?.id === (id || this.props.state.current_playlist_id)
        );

    getCurrentSrc = (id?: number): string => {
        const [song] =
            (this.getCurrentPlaylist(id)[0]?.nested as ISong[])?.sort((a, b) => by(a, b, 'song_index')) || [];

        let pathToSong = '';

        if (song) {
            pathToSong = song.path;
        }

        return pathToSong;
    };

    play = async (): Promise<void> => {
        this.state.status !== 'playing' && this.setState({ status: 'playing' });
        setTimeout(() => {
            this.props.audioHandler.play();
        }, 20);
    };

    pause = (stop?: boolean): void => {
        if (stop) {
            this.props.audioHandler.stop();
            return this.setState({ status: 'stopped', time: 0 });
        }

        this.props.audioHandler.pause();
        return this.setState({ status: 'paused' });
    };

    tempPause = (): void => {
        this.props.audioHandler.pause();
    };

    nextsong = async (): Promise<void> => {
        // if (!this.player) return;
        this.props.audioHandler.nextsong();
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
                this.props.state.loop && this.play();
            }, this.props.state.wait_between * 1000);

            return;
        }

        const randomizer = !this.state.randomized?.length && new Randomize(current?.nested.length || 1);

        const randomized = !randomizer
            ? this.state.randomized?.filter(item => {
                  return item !== this.state.randomized?.[0];
              })
            : await randomizer.randomizarray();

        this.setState({ randomized });
        const pointer = this.props.state.random ? this.state.randomized?.[0] : this.state.pointer + 1;

        await this.handleAction('CHANGE_SONG', {
            pointer,
        });
    };

    lastsong = async (): Promise<void> => {
        this.props.audioHandler.lastsong();

        if (this.state.pointer > 0) {
            await this.handleAction('CHANGE_SONG', {
                pointer: this.state.pointer - 1,
            });
        }
    };

    rewind = (): void => {
        const { audioHandler } = this.props;
        const playing = audioHandler.getStatus() === 'PLAY';
        const position = audioHandler.getPosition();

        this.tempPause();
        this.setCurrentTime(position < 5 ? 0 : position - 5);

        playing && this.play();
    };

    forward = (): void => {
        const { audioHandler } = this.props;
        const playing = audioHandler.getStatus() === 'PLAY';
        const position = audioHandler.getPosition();

        this.tempPause();
        this.setCurrentTime(position + 5);

        playing && this.play();
    };

    getCurrentTime = (): number => this.props.audioHandler.getPosition();

    setCurrentTime = (time: number): void => {
        this.setState({ time });
        this.props.audioHandler.setPosition(time);
    };

    addSongModal = (): Promise<void> => this.handleAction('ADD_SONG_MODAL');

    render() {
        const { tree, sinewaveC, frequencyC } = this.props;
        const { status, pointer, loading, src } = this.state;

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
                <audio ref={el => (this.player = el)} src={src} />
                <MainPage
                    sinewaveC={sinewaveC}
                    frequencyC={frequencyC}
                    current={current}
                    currentPlaylistId={currentPlaylistId}
                    pointer={pointer}
                    tree={tree}
                    showExplorer={showExplorer}
                    isPrefsOpen={isPrefsOpen}
                    loading={loading}
                    loop={loop}
                    random={random}
                    status={status}
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
                    player={this.props.audioHandler}
                />
            </>
        );
    }
}

const mapStateToProps = ({ tree, state }: RootState) => {
    return { tree, state };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    fetchTreeDispatch: (payload: TreeListType[]) => dispatch(fetchTree(payload)),
    createPlaylistDispatch: (payload?: TreeListType) => dispatch(createTempPlaylist(payload)),
    savePlaylistDispatch: (payload: TreeListType, extra?: any) => dispatch(savePlaylist(payload, extra)),
    deletePlaylistDispatch: (payload: TreeListType) => dispatch(deleteFromTree(payload)),
    deleteSongDispatch: (payload: TreeListType) => dispatch(deleteSong(payload)),
    updatePlaylistDispatch: (payload: TreeListType) => dispatch(updatePlaylist(payload)),
    sortPlaylistDispatch: (payload: TreeListType) => dispatch(sortPlaylist(payload)),

    fetchStateDispatch: (payload: IState) => dispatch(fetchState(payload)),
    updateStateDispatch: (payload: Partial<IState>) => dispatch(updateState(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
