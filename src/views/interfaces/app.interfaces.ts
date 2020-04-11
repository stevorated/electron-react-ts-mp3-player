import { IState } from '@services/db';
import { TreeListType } from './index';

export type FftSizes = 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768;

export type CanvasType = 'sine' | 'freq';

export type HandleLoadFileOptions = {
    fftSize: FftSizes;
    // canvasType: CanvasType;
};

export type AllHandlerActions = MainAction | HandlerAction | StateHandlerAction;

export type MainAction = 'ACC_FF' | 'ACC_NEXT' | 'ACC_LAST' | 'ACC_REWIND' | 'ACC_PLAY_PAUSE';

export type HandlerAction =
    | 'FETCH_TREE'
    | 'FETCH_REMOTE_STATE'
    | 'UPDATE_REMOTE_STATE'
    | 'CREATE_PLAYLIST_TEMP'
    | 'SAVE_PLAYLIST'
    | 'UPDATE_PLAYLIST'
    | 'RELOAD_PLAYLIST'
    | 'SORT_PLAYLIST'
    | 'UPDATE_SONG'
    | 'ADD_SONG_MODAL'
    | 'ADD_SONG_DROP'
    | 'DELETE_PLAYLIST'
    | 'DELETE_SONG';

export type StateHandlerAction =
    | 'OPEN_PREFRENCES'
    | 'SWITCH_PLAYLIST'
    | 'TOGGLE_SIDEBAR'
    | 'CHANGE_WAIT_BETWEEN'
    | 'CHANGE_SONG'
    | 'SET_STATUS'
    | 'SET_VOLUME'
    | 'SET_STATE';

export type DispatchProps = {
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

export type StatusType = 'ready' | 'playing' | 'paused' | 'stopped' | 'done' | 'loading' | 'waiting...';

export type AppState = {
    time: number;
    pointer: number;
    src: string;
    loading: boolean;
    status: StatusType;
    randomized?: number[];
    source: MediaElementAudioSourceNode | null;
    fftSize: FftSizes;
};

export type StateProps = {
    tree: TreeListType[];
    state: IState;
};
