import { PlaylistType } from '../interfaces';

export default interface Page {
    theme?: string;
    playlists: PlaylistType[];
    loadAllPlaylists: (payload: PlaylistType[]) => void;
}
