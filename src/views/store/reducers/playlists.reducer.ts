import { PlaylistActions } from '@views/interfaces';
import { IPlaylist } from '@services/db';

import { LOAD_ALL_PLAYLISTS } from '../actions';

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
