import { PlaylistActions } from '../../interfaces';
import { LOAD_ALL_PLAYLISTS, CREATE_PLAYLIST } from '../../interfaces';
import { DELETE_PLAYLIST } from '../../interfaces';
import { PlaylistType } from 'src/views/constants/mocks';

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
