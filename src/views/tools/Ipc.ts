import { Channels } from '../../main';
import { ipcRenderer } from 'electron';
import { HandlerAction } from '../interfaces';

export class Ipc {
    static invoke(
        channel: Channels,
        action: (action: HandlerAction, payload: any) => void,
        args?: any,
        handlerAction?: HandlerAction
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            ipcRenderer
                .invoke(channel, args)
                .then(payload => {
                    action(
                        handlerAction || (channel as HandlerAction),
                        payload
                    );
                    resolve(true);
                })
                .catch(err => reject(err));
        });
    }

    static sendAndReduce(channel: Channels, action: (payload: any) => void) {
        const { ipcRenderer } = window.require('electron');

        ipcRenderer.send(channel);

        ipcRenderer.on(channel, (e, args) => {
            action(args);
        });
    }

    static sendAndRecieve(channel: Channels, args?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const { ipcRenderer } = window.require('electron');

                ipcRenderer.send(channel, args);

                ipcRenderer.on(channel, (e, args) => {
                    resolve(args);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}
