import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../logger/logger';

export type Channels =
    | 'MENU_SAVE_PLAYLIST'
    | 'MENU_ADD_SONG'
    | 'MENU_OPEN_PREFRENCES'
    | 'MENU_TOGGLE_SIDEBAR'
    | 'FETCH_TREE'
    | 'SAVE_PLAYLIST'
    | 'SORT_PLAYLIST'
    | 'UPDATE_PLAYLIST'
    | 'UPDATE_SONG'
    | 'ADD_SONG'
    | 'DROP_SONG'
    | 'DELETE_PLAYLIST'
    | 'DELETE_SONG';

const logger = new Logger('main');

export const handleEvent = (
    channel: Channels,
    handler: (event: IpcMainInvokeEvent, args: any) => any
) => {
    ipcMain.handle(channel, (event, args) => {
        logger.info(`Ipc Action - ${channel}`, args);
        return handler(event, args);
    });
};

export const sendToRenderer = (channel: Channels, args: any) => {
    logger.info(`Ipc Send to Renderer ${channel}`, { data: args });
};
