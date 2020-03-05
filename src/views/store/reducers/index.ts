import { combineReducers } from 'redux';
import { playlistsReducer } from './playlists.reducer';
import { treeReducer } from './tree.reducer';

export const rootReducer = combineReducers({
    playlists: playlistsReducer,
    tree: treeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
