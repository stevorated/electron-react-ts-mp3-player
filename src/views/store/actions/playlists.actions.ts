import { PlaylistActions } from '../../interfaces';
import { LOAD_ALL_PLAYLISTS } from '../../interfaces/data.interfaces';
import { PlaylistType } from 'src/views/constants/mocks';

export function loadAllPlaylists(playlists: PlaylistType[]): PlaylistActions {
    return {
        type: LOAD_ALL_PLAYLISTS,
        payload: playlists,
    };
}
