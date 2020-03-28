export * from './tree.interfaces';
export * from './state.interfaces';

export type StatusType =
    | 'ready'
    | 'playing'
    | 'paused'
    | 'stopped'
    | 'done'
    | 'loading'
    | 'waiting...';

export type AllHandlerActions = MainAction | HandlerAction | StateHandlerAction;

export type MainAction =
    | 'ACC_FF'
    | 'ACC_NEXT'
    | 'ACC_LAST'
    | 'ACC_REWIND'
    | 'ACC_PLAY_PAUSE';

export type HandlerAction =
    | 'FETCH_TREE'
    | 'FETCH_REMOTE_STATE'
    | 'UPDATE_REMOTE_STATE'
    | 'CREATE_PLAYLIST_TEMP'
    | 'SAVE_PLAYLIST'
    | 'UPDATE_PLAYLIST'
    | 'SORT_PLAYLIST'
    | 'UPDATE_SONG'
    | 'ADD_SONG_MODAL'
    | 'ADD_SONG_DROP'
    | 'DELETE_PLAYLIST'
    | 'DELETE_SONG';

export type StateHandlerAction =
    | 'OPEN_PREFRENCES'
    | 'SWITCH_PLAYLIST'
    | 'TOGGLE_SIDEBAR'
    | 'CHANGE_WAIT_BETWEEN'
    | 'CHANGE_SONG'
    | 'SET_STATUS'
    | 'SET_VOLUME'
    | 'SET_STATE';
