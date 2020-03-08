import { TreeActions, TreeListType } from '../../interfaces';
import {
    FETCH_TREE,
    CREATE_PLAYLIST_TREE,
    UPDATE_PLAYLIST_TREE,
    DELETE_PLAYLIST_TREE,
} from '../actions';

const initialState: TreeListType[] = [];

export const treeReducer = (
    state: TreeListType[] = initialState,
    { type, payload, id }: TreeActions
): TreeListType[] => {
    switch (type) {
        case FETCH_TREE:
            return payload;
        case UPDATE_PLAYLIST_TREE:
            return state.map(item => {
                if (id === item.id) {
                    return {
                        ...payload[0],
                    };
                }
                return item;
            });
        case DELETE_PLAYLIST_TREE:
            return state.filter(item => {
                return !(
                    item.id === payload[0]?.id && item.type === payload[0].type
                );
            });
        case CREATE_PLAYLIST_TREE:
            return state.concat(payload);

        default:
            return state;
    }
};
