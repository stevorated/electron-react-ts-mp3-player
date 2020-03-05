import { IPlaylist } from '../../services/db';
import { TreeListType } from './data.interfaces';

export default interface Page {
    theme?: string;
    playlists: IPlaylist[];
    tree: TreeListType[];
    loadAllPlaylists: (payload: IPlaylist[]) => void;
    loadTree: (payload: TreeListType[]) => void;
}
