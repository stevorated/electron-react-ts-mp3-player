export interface ISong {
    id?: number;
    title: string;
    path: string;
    length: number;
    created_at?: string;
    song_index?: number;
}

export interface IPlaylist {
    id?: string;
    title: string;
    songs?: ISong[];
    parent?: number;
    length: number;
    createdAt?: string;
}

export interface IFolder {
    id?: string;
    title: string;
    playlists?: any[];
    length: number;
    createdAt?: string;
}
