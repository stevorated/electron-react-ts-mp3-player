import {
    LoadAllPlaylists,
    PlaylistActions,
} from './data.interfaces';
import { PlaylistType } from '../constants/mocks';

export default interface Page {
    theme?: string;
    playlists: PlaylistType[];
    loadAllPlaylists: (payload: PlaylistType[]) => void;
}
