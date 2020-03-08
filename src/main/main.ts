import { app, dialog } from 'electron';
import path from 'path';
import { Window } from './Window';
import { DataHandler } from './DataHandler';
import { handleEvent } from './Ipc';
import { Modal } from './modal';

app.allowRendererProcessReuse = true;
function main() {
    let mainWindow: Window | null = new Window({
        file: `${path.join(app.getAppPath(), './index.html')}`,
        windowSettings: {},
    });
}

app.on('ready', main);

handleEvent('FETCH_TREE', async () => {
    console.log('FETCH_TREE INVOKED');
    const result = await DataHandler.fetchTree();
    return result;
});

handleEvent('FETCH_PLAYLISTS', async () => {
    console.log('FETCH_PLAYLISTS INVOKED');
    const result = await DataHandler.fetchPlaylists();
    return result;
});

handleEvent('SAVE_PLAYLIST', async (e, title) => {
    console.log('SAVE_PLAYLIST INVOKED', title);
    const id = await DataHandler.createPlaylist(title);
    return id;
    // return result;
});

handleEvent('ADD_FILE_DIALOG', async (e, args) => {
    console.log('ADD_FILE_DIALOG INVOKED', args);

    return dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
    });
});
