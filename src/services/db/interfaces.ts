export interface ISong {
    id?: string;
    title: string;
    path: string;
    length: number;
    createdAt?: string;
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
