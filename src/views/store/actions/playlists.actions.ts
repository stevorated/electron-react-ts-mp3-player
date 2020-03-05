import { PlaylistActions } from '../../interfaces';
import { IPlaylist } from '../../../services/db';
import { LOAD_ALL_PLAYLISTS } from '../../interfaces/data.interfaces';

export function loadAllPlaylists(playlists: IPlaylist[]): PlaylistActions {
    return {
        type: LOAD_ALL_PLAYLISTS,
        payload: playlists,
    };
}
