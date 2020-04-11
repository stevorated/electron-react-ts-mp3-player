import { ipcRenderer } from 'electron';

import { AllHandlerActions } from '@views/interfaces';

import { Channels } from '../../main';
import { HandlerAction } from '../interfaces';
import { AudioHandler } from './../components/middle/partials/songsList/audioHandler/AudioHandler';

export class Ipc {
    static invoke<T>(channel: Channels, args: any): Promise<T> {
        return new Promise((resolve, reject) => {
            ipcRenderer
                .invoke(channel, args)
                .then(res => {
                    resolve(res as T);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    static invokeAndHandle(
        channel: Channels,
        action: (action: HandlerAction, payload: any) => void,
        args?: any,
        handlerAction?: HandlerAction
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            ipcRenderer
                .invoke(channel, args)
                .then(payload => {
                    action(handlerAction || (channel as HandlerAction), payload);
                    resolve(payload);
                })
                .catch(err => reject(err));
        });
    }

    static invokeAndReturn<T>(channel: Channels, args?: any): Promise<T> {
        return new Promise((resolve, reject) => {
            ipcRenderer
                .invoke(channel, args)
                .then(payload => {
                    resolve(payload);
                })
                .catch(err => reject(err));
        });
    }

    static listen(channel: Channels, listener: (event: Electron.IpcRendererEvent, ...args: any) => any) {
        return ipcRenderer.on(channel, listener);
    }
}

export const setupListeners = async (
    handler: (action: AllHandlerActions, payload?: any) => Promise<void>,
    player: AudioHandler
) => {
    Ipc.listen('MENU_ADD_SONG', async () => handler('ADD_SONG_MODAL'));

    Ipc.listen('MENU_SAVE_PLAYLIST', async () => handler('CREATE_PLAYLIST_TEMP'));

    Ipc.listen('MENU_OPEN_PREFRENCES', async () => handler('OPEN_PREFRENCES'));

    Ipc.listen('MENU_TOGGLE_SIDEBAR', async () => handler('TOGGLE_SIDEBAR'));

    Ipc.listen('ACC_PLAY_PAUSE', async () => handler('ACC_PLAY_PAUSE'));

    Ipc.listen('ACC_FF', async () => handler('ACC_FF'));

    Ipc.listen('ACC_REWIND', async () => handler('ACC_REWIND'));

    Ipc.listen('ACC_DOWN', async () => {
        await handler('SET_VOLUME', player.getVolume() - 0.05);
    });

    Ipc.listen('ACC_UP', async () => {
        if (!player) {
            return;
        }

        await handler('SET_VOLUME', player.getVolume() + 0.05);
    });
};
