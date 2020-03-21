import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../logger/logger';

export type Channels =
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
        logger.info(`Ipc Action - ${channel}`, { data: args });
        return handler(event, args);
    });
};
