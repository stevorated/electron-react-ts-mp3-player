import { Channels } from '../../main';
import { ipcRenderer } from 'electron';
import { HandlerAction } from '../interfaces';

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
                    action(
                        handlerAction || (channel as HandlerAction),
                        payload
                    );
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

    static sendAndReduce(
        channel: Channels,
        action: (payload: any) => void,
        args?: any[]
    ) {
        return new Promise((resolve, reject) => {
            const { ipcRenderer } = window.require('electron');

            ipcRenderer.send(channel, args);

            ipcRenderer
                .invoke(channel)
                .then(d => {
                    action(d);
                    resolve();
                })
                .catch(e => reject(e));
        });
    }

    static sendAndRecieve(channel: Channels, args?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const { ipcRenderer } = window.require('electron');

                ipcRenderer.send(channel, args);

                ipcRenderer.on(channel, (_, args) => {
                    resolve(args);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}
