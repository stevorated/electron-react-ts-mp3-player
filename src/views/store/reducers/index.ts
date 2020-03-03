import { combineReducers } from 'redux';
import { playlistsReducer } from './playlists.reducer';

export const rootReducer = combineReducers({
    playlists: playlistsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
