import { PlaylistType } from 'src/views/constants/mocks';

export const LOAD_ALL_PLAYLISTS = 'LOAD_ALL_PLAYLISTS';
export const LOAD_PLAYLIST_WITH_SONGS = 'LOAD_PLAYLISTS_WITH_SONGS';
export const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
export const DELETE_PLAYLIST = 'DELETE_PLAYLIST';

export interface LoadAllPlaylists {
    type: typeof LOAD_ALL_PLAYLISTS;
    payload: PlaylistType[];
}

export type PlaylistActions = LoadAllPlaylists;
