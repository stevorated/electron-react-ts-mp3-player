export * from './data.interfaces';

export type HandlerAction =
    | 'FETCH_TREE'
    | 'FETCH_PLAYLISTS'
    | 'CREATE_PLAYLIST'
    | 'CREATE_PLAYLIST_SAVE'
    | 'DELETE_PLAYLIST'
    | 'HANDLE_SWITCH_PLAYLIST'
    | 'SET_CURRENT'
    | 'SET_STATUS'
    | 'HANDLE_OPEN_MODAL';
