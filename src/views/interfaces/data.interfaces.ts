import { IPlaylist } from '@services/db';
import {
    FETCH_TREE,
    LOAD_ALL_PLAYLISTS,
    CREATE_PLAYLIST_TREE,
    UPDATE_PLAYLIST_TREE,
    DELETE_PLAYLIST_TREE,
} from '@views/store/actions';

export type TreeListType = {
    id?: number;
    title: string;
    type: 'playlist' | 'folder';
    nested: TreeListType[];
};

export interface LoadAllPlaylists {
    type: typeof LOAD_ALL_PLAYLISTS;
    payload: IPlaylist[];
    id?: number;
}

export interface FetchTree {
    type: typeof FETCH_TREE;
    payload: TreeListType[];
    id?: number;
}

export interface CreateTempPlaylist {
    type: typeof CREATE_PLAYLIST_TREE;
    payload: TreeListType[];
    id?: number;
}

export interface UpdateTreePlaylist {
    type: typeof UPDATE_PLAYLIST_TREE;
    payload: TreeListType[];
    id?: number;
}

export interface DeletePlaylistTree {
    type: typeof DELETE_PLAYLIST_TREE;
    payload: TreeListType[];
    id?: number;
}

export type PlaylistActions = LoadAllPlaylists;
export type TreeActions =
    | FetchTree
    | CreateTempPlaylist
    | UpdateTreePlaylist
    | DeletePlaylistTree;
