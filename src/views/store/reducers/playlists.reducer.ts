import { PlaylistActions, PlaylistType } from '../../interfaces';
import { LOAD_ALL_PLAYLISTS } from '../../interfaces';
import { IPlaylist } from '../../../services/db';

const initialState: IPlaylist[] = [];

export const playlistsReducer = (
    state: IPlaylist[] = initialState,
    { type, payload }: PlaylistActions
): IPlaylist[] => {
    switch (type) {
        case LOAD_ALL_PLAYLISTS:
            return payload;
        default:
            return state;
    }
};
