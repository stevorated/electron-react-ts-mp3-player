import { IpcChannels } from '../../main';

export class Ipc {
    static sendAndReduce(channel: IpcChannels, action: (payload: any) => void) {
        const { ipcRenderer } = window.require('electron');

        ipcRenderer.send(channel);

        ipcRenderer.on(channel, (e, args) => {
            action(args);
        });
    }

    static sendAndRecieve(channel: IpcChannels, args?: any): Promise<any> {
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
