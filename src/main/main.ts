import { app } from 'electron';
import path from 'path';
import { Window } from './Window';
import { DataHandler } from './DataHandler';
import { reply, execute } from './Ipc';
import { Modal } from './modal';

app.allowRendererProcessReuse = true;
function main() {
    let modal: Modal | null = new Modal({
        file: `${path.join(app.getAppPath(), './index.html/#hello')}`,
    });

    modal?.hide();

    execute('TOGGLE_NEW_PLAYLIST_MODAL', () => {
        console.log('TOGGLE_NEW_PLAYLIST_MODAL');
        modal?.show();
    });

    // execute('SAVE_PLAYLIST', () => {
    //     console.log('SAVE_PLAYLIST');
    //     // DataHandler.createPlaylist()
    // });

    let mainWindow: Window | null = new Window({
        file: `${path.join(app.getAppPath(), './index.html')}`,
        windowSettings: {},
    });
}

app.on('ready', main);

DataHandler.fetchSendPlaylists().then(d => {
    reply('FETCH_PLAYLISTS', d);
});

DataHandler.fetchSendTree().then(d => {
    reply('FETCH_TREE', d);
});
