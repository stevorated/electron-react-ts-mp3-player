import { PlaylistActions, PlaylistType } from '../../interfaces';
import { LOAD_ALL_PLAYLISTS } from '../../interfaces';

const initialState: PlaylistType[] = [];

export const playlistsReducer = (
    state: PlaylistType[] = initialState,
    { type, payload }: PlaylistActions
): PlaylistType[] => {
    switch (type) {
        case LOAD_ALL_PLAYLISTS:
            console.log('HEREE');
            return payload;
        default:
            return state;
    }
};
