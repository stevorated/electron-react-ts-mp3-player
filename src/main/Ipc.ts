import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../logger/logger';

export type Channels =
    | 'FETCH_TREE'
    | 'SAVE_PLAYLIST'
    | 'FETCH_PLAYLISTS'
    | 'ADD_FILE_DIALOG';

const logger = new Logger('main');

export const handleEvent = (
    channel: Channels,
    handler: (event: IpcMainInvokeEvent, args: any) => any
) => {
    ipcMain.handle(channel, (event, args) => {
        logger.info(`Ipc Action - ${channel}`, [args, event]);
        return handler(event, args);
    });
};
