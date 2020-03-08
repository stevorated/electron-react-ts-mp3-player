import { ipcMain, IpcMainInvokeEvent } from 'electron';

export type Channels =
    | 'FETCH_TREE'
    | 'SAVE_PLAYLIST'
    | 'FETCH_PLAYLISTS'
    | 'ADD_FILE_DIALOG';

export const handleEvent = (
    channel: Channels,
    handler: (event: IpcMainInvokeEvent, args: any) => any
) => {
    ipcMain.handle(channel, handler);
};
