import { PlaylistActions, PlaylistType } from '../../interfaces';
import { LOAD_ALL_PLAYLISTS } from '../../interfaces/data.interfaces';

export function loadAllPlaylists(playlists: PlaylistType[]): PlaylistActions {
    return {
        type: LOAD_ALL_PLAYLISTS,
        payload: playlists,
    };
}
