import { IState } from '@services/db';
import { TreeListType } from './index';

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

export type StatusType =
    | 'ready'
    | 'playing'
    | 'paused'
    | 'stopped'
    | 'done'
    | 'loading'
    | 'waiting...';

export type AppState = {
    time: number;
    pointer: number;
    src: string;
    loading: boolean;
    status: StatusType;
    randomized?: number[];
    source: MediaElementAudioSourceNode | null;
};

export type StateProps = {
    tree: TreeListType[];
    state: IState;
};
