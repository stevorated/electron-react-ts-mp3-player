import { ipcMain } from 'electron';
import { DataHandler } from './DataHandler';

export type IpcChannels =
    | 'FETCH_PLAYLISTS'
    | 'FETCH_TREE'
    | 'CREATE_PLAYLIST'
    | 'TOGGLE_NEW_PLAYLIST_MODAL'
    | 'SAVE_PLAYLIST';

export const reply = (channel: IpcChannels, cb: any) => {
    ipcMain.on(channel, (e, arg) => {
        e.reply(channel, cb);
    });
};

export const execute = (channel: IpcChannels, cb: () => any) => {
    ipcMain.on(channel, (e, args) => {
        cb();
        console.log(args);
        // DataHandler.createPlaylist(args.title).then(d => {
        // console.log('SAVED!!!!', d);
        // });
        reply(channel, 'DONE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    });
};
