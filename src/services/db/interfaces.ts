import { FftSizes, CanvasType } from '@views/interfaces';

export interface IState {
    id: number;
    volume: number;
    wait_between: number;
    show_explorer: boolean;
    random: boolean;
    current_playlist_id: number;
    loop: boolean;
    is_prefs_open: boolean;
    fft_size: FftSizes;
    canvas_type: CanvasType;
    created_at: string;
}

export interface IPrefs {
    id: number;
    wait_between: number;
    created_at: string;
}

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
    playlist_index: number;
    title: string;
    songs?: ISong[];
    parent: number | null;
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
