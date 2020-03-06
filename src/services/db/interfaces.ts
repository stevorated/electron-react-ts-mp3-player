export interface ISong {
    id?: number;
    title: string;
    path: string;
    length: number;
    created_at?: string;
    song_index?: number;
}

export interface IPlaylist {
    id?: number;
    title: string;
    songs?: ISong[];
    parent?: number;
    length: number;
    created_at?: string;
}

export interface IFolder {
    id?: number;
    title: string;
    playlists?: any[];
    length: number;
    created_at?: string;
}
