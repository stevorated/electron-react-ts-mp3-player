import { ISong, IPlaylist } from './../../services/db';
import {
    LOAD_TREE,
    LOAD_ALL_PLAYLISTS,
    UPDATE_PLAYLIST,
    DELETE_PLAYLIST_FROM_TREE,
} from '../store/actions';
import { LOAD_PLAYLIST_WITH_SONGS, CREATE_PLAYLIST } from '../store/actions';
import { DELETE_PLAYLIST } from '../store/actions';

export type TreeListType = {
    id?: number;
    title: string;
    type: 'playlist' | 'folder';
    nested: TreeListType[];
};

export interface LoadAllPlaylists {
    type: typeof LOAD_ALL_PLAYLISTS;
    payload: IPlaylist[];
    extra?: any;
}

export interface LoadTree {
    type: typeof LOAD_TREE;
    payload: TreeListType[];
    extra?: any;
}

export interface AddToTree {
    type: typeof CREATE_PLAYLIST;
    payload: TreeListType[];
    extra?: any;
}

export interface UpdateTree {
    type: typeof UPDATE_PLAYLIST;
    payload: TreeListType[];
    extra?: any;
}

export interface DeletePlaylistFromTree {
    type: typeof DELETE_PLAYLIST_FROM_TREE;
    payload: TreeListType[];
    extra?: any;
}

export type PlaylistActions = LoadAllPlaylists;
export type TreeActions =
    | LoadTree
    | AddToTree
    | UpdateTree
    | DeletePlaylistFromTree;
