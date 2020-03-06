import { TreeActions, TreeListType } from '../../interfaces';
import { CREATE_PLAYLIST, UPDATE_PLAYLIST } from './playlists.actions';
import { v4 as uuid } from 'uuid';

export const LOAD_TREE = 'LOAD_TREE';
export const DELETE_PLAYLIST_FROM_TREE = 'DELETE_PLAYLIST_FROM_TREE';

export function loadTree(tree: TreeListType[]): TreeActions {
    return {
        type: LOAD_TREE,
        payload: tree,
    };
}

export function createTempTreePlaylist(tree?: TreeListType): TreeActions {
    return {
        type: CREATE_PLAYLIST,
        payload: tree
            ? [tree]
            : [
                  {
                      //   id: Math.round(Math.random() * 100000000000000),
                      id: 666,
                      title: 'new playlist',
                      type: 'playlist',
                      nested: [],
                  },
              ],
    };
}

export function updateTreePlaylist(
    item: TreeListType,
    oldId?: number
): TreeActions {
    return {
        type: UPDATE_PLAYLIST,
        payload: [item],
        extra: oldId,
    };
}

export function deleteFromTree(item: TreeListType) {
    return {
        type: DELETE_PLAYLIST_FROM_TREE,
        payload: [item],
    };
}
