// import { PlaylistType } from 'src/views/constants/mocks';
import { ISong, IPlaylist } from './../../services/db';

export const LOAD_TREE = 'LOAD_TREE';
export const LOAD_ALL_PLAYLISTS = 'LOAD_ALL_PLAYLISTS';
export const LOAD_PLAYLIST_WITH_SONGS = 'LOAD_PLAYLISTS_WITH_SONGS';
export const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
export const DELETE_PLAYLIST = 'DELETE_PLAYLIST';

export type TreeListType = {
    id: number;
    title: string;
    type: 'playlist' | 'folder';
    nested: TreeListType[];
};

export type SongType = ISong;

// export type SongType = {
//     id: number;
//     title: string;
//     path: string;
//     length: number;
//     created_at: string;
//     song_index: number;
// };

export type PlaylistType = {
    id: number;
    title: string;
    length: number;
    parent: string;
    created_at?: string;
    songs: SongType[];
};

export interface LoadAllPlaylists {
    type: typeof LOAD_ALL_PLAYLISTS;
    payload: IPlaylist[];
}

export interface LoadTree {
    type: typeof LOAD_TREE;
    payload: TreeListType[];
}

export type PlaylistActions = LoadAllPlaylists;
export type TreeActions = LoadTree;
