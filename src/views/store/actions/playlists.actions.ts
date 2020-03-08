import { IPlaylist } from '@services/db';

import { PlaylistActions } from '@views/interfaces';

export const LOAD_ALL_PLAYLISTS = 'LOAD_ALL_PLAYLISTS';
export const LOAD_PLAYLIST_WITH_SONGS = 'LOAD_PLAYLISTS_WITH_SONGS';
export const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
export const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
export const DELETE_PLAYLIST = 'DELETE_PLAYLIST';

export function loadAllPlaylists(playlists: IPlaylist[]): PlaylistActions {
    return {
        type: LOAD_ALL_PLAYLISTS,
        payload: playlists,
    };
}
