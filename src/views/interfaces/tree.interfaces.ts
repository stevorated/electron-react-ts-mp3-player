import { ISong } from '@services/db';

import {
    FETCH_TREE,
    CREATE_PLAYLIST_TREE,
    SAVE_PLAYLIST_TREE,
    UPDATE_PLAYLIST_TREE,
    DELETE_PLAYLIST_TREE,
    DELETE_SONG_TREE,
    SORT_PLAYLIST_TREE,
} from '@views/store';

export type TreeListType = {
    id?: number;
    title: string;
    type: 'playlist' | 'folder';
    nested: TreeListType[] | ISong[];
};

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

export interface SaveTreePlaylist {
    type: typeof SAVE_PLAYLIST_TREE;
    payload: TreeListType[];
    id?: number;
}

export interface SortTreePlaylist {
    type: typeof SORT_PLAYLIST_TREE;
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

export interface DeleteSongTree {
    type: typeof DELETE_SONG_TREE;
    payload: TreeListType[];
    id?: number;
}

export type TreeActions =
    | FetchTree
    | CreateTempPlaylist
    | SaveTreePlaylist
    | UpdateTreePlaylist
    | DeletePlaylistTree
    | DeleteSongTree
    | SortTreePlaylist;
