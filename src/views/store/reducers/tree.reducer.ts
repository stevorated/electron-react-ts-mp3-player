import { TreeActions, TreeListType } from '../../interfaces';
import {
    FETCH_TREE,
    CREATE_PLAYLIST_TREE,
    SAVE_PLAYLIST_TREE,
    SORT_PLAYLIST_TREE,
    DELETE_PLAYLIST_TREE,
    DELETE_SONG_TREE,
    UPDATE_PLAYLIST_TREE,
} from '../actions';

const initialState: TreeListType[] = [];

export const treeReducer = (
    state: TreeListType[] = initialState,
    { type, payload, id }: TreeActions
): TreeListType[] => {
    switch (type) {
        case FETCH_TREE:
            return payload;
        case CREATE_PLAYLIST_TREE:
            return state.concat(payload);
        case DELETE_PLAYLIST_TREE:
            return state.filter(
                item => item.id !== payload?.[0]?.id && item.type === 'playlist'
            );
        case SAVE_PLAYLIST_TREE:
            return state.map(item => {
                if (id && id === item.id) {
                    return payload[0];
                }

                if (item.id === payload?.[0]?.id) {
                    return payload[0];
                }

                return item;
            });

        case SORT_PLAYLIST_TREE:
            return state.map(item => {
                // console.log(payload, id);
                if (item.id === id) {
                    return payload[0];
                }
                return item;
            });
        case UPDATE_PLAYLIST_TREE:
            return state.map(item => {
                if (item?.id === payload[0].id) {
                    return payload[0];
                }
                return item;
            });
        case DELETE_SONG_TREE:
            return state.map(item => {
                if (item.type === 'playlist' && item.id === payload[0]?.id) {
                    return payload[0];
                }
                return item;
            });

        default:
            return state;
    }
};
