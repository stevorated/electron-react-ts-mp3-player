import { TreeActions, TreeListType } from '../../interfaces';
import { LOAD_TREE } from '../../interfaces';

const initialState: TreeListType[] = [];

export const treeReducer = (
    state: TreeListType[] = initialState,
    { type, payload }: TreeActions
): TreeListType[] => {
    switch (type) {
        case LOAD_TREE:
            return payload;
        default:
            return state;
    }
};
