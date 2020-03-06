import { TreeActions, TreeListType } from '../../interfaces';
import {
    LOAD_TREE,
    CREATE_PLAYLIST,
    UPDATE_PLAYLIST,
    DELETE_PLAYLIST_FROM_TREE,
} from '../actions';

const initialState: TreeListType[] = [];

export const treeReducer = (
    state: TreeListType[] = initialState,
    { type, payload, extra }: TreeActions
): TreeListType[] => {
    switch (type) {
        case LOAD_TREE:
            return payload;
        case UPDATE_PLAYLIST:
            return state.map(item => {
                if (extra === item.id) {
                    return {
                        ...payload[0],
                    };
                }
                return item;
            });
        case UPDATE_PLAYLIST:
            return state.map(item => {
                if (extra === item.id) {
                    return {
                        ...payload[0],
                    };
                }
                return item;
            });
        case DELETE_PLAYLIST_FROM_TREE:
            return state.filter(item => {
                return !(
                    item.id === payload[0]?.id && item.type === payload[0].type
                );
            });
        case CREATE_PLAYLIST:
            return state.concat(payload);

        default:
            return state;
    }
};
