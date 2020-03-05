import { TreeActions, TreeListType } from '../../interfaces';
import { LOAD_TREE } from '../../interfaces/data.interfaces';

export function loadTree(tree: TreeListType[]): TreeActions {
    return {
        type: LOAD_TREE,
        payload: tree,
    };
}
