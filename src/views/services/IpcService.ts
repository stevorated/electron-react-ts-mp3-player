import { IpcChannels } from './ipc.interfaces';

export class IpcService {
    static sendAndReduce(channel: IpcChannels, action: (payload: any) => void) {
        const { ipcRenderer } = window.require('electron');

        ipcRenderer.send(channel);

        ipcRenderer.on(channel, (e, args) => {
            action(args);
        });
    }
}
