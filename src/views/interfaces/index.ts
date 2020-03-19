export * from './data.interfaces';

export type HandlerAction =
    | 'FETCH_TREE'
    | 'CREATE_PLAYLIST_TEMP'
    | 'SAVE_PLAYLIST'
    | 'UPDATE_PLAYLIST'
    | 'SORT_SONGS'
    | 'UPDATE_SONG'
    | 'ADD_SONG_MODAL'
    | 'DELETE_PLAYLIST'
    | 'DELETE_SONG';

export type StateHandlerAction =
    | 'SWITCH_PLAYLIST'
    | 'CHANGE_SONG'
    | 'SET_STATUS'
    | 'SET_STATE';
