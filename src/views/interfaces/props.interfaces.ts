import { IPlaylist } from '../../services/db';
import { TreeListType, UpdateTree } from './data.interfaces';

export interface IPage {
    theme?: string;
    playlists: IPlaylist[];
    tree: TreeListType[];
    loadAllPlaylists: (payload: IPlaylist[]) => void;
    loadTree: (payload: TreeListType[]) => void;
    updateTree: (payload: TreeListType, extra?: any) => void;
    deleteFromTree: (payload?: TreeListType) => void;
    createPlaylist: (payload?: TreeListType) => void;

}

export type HandlerAction =
    | 'switch'
    | 'changeSong'
    | 'openCreatePlaylistModal'
    | 'statusChange'
    | 'createPlaylist'
    | 'updateTree'
    | 'deleteTreeItem';
