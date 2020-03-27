import { combineReducers } from 'redux';
import { treeReducer } from './tree.reducer';
import { stateReducer } from './state.reducer';

export const rootReducer = combineReducers({
    tree: treeReducer,
    state: stateReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
