import { TreeActions, TreeListType } from '@views/interfaces';

export const FETCH_TREE = 'FETCH_TREE';
export function fetchTree(tree: TreeListType[]): TreeActions {
    return {
        type: FETCH_TREE,
        payload: tree,
    };
}

export const CREATE_PLAYLIST_TREE = 'CREATE_PLAYLIST_TREE';
export function createTempPlaylist(tree?: TreeListType): TreeActions {
    return {
        type: CREATE_PLAYLIST_TREE,
        payload: tree
            ? [tree]
            : [
                  {
                      id: 666,
                      title: 'new playlist',
                      type: 'playlist',
                      nested: [],
                  },
              ],
    };
}

export const UPDATE_PLAYLIST_TREE = 'UPDATE_PLAYLIST_TREE';
export function updateTreePlaylist(
    item: TreeListType,
    oldId?: number
): TreeActions {
    return {
        type: UPDATE_PLAYLIST_TREE,
        payload: [item],
        id: oldId,
    };
}

export const DELETE_PLAYLIST_TREE = 'DELETE_PLAYLIST_TREE';
export function deleteFromTree(item: TreeListType) {
    return {
        type: DELETE_PLAYLIST_TREE,
        payload: [item],
    };
}
