import { combineReducers } from 'redux';
import { treeReducer } from './tree.reducer';

export const rootReducer = combineReducers({
    tree: treeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
