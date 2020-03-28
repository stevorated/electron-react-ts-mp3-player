import { app, ipcMain } from 'electron';
import path from 'path';
import { Window } from './Window';
import { DataHandler } from './DataHandler';

function main() {
    const mainWindow = new Window({
        file: `${path.join(app.getAppPath(), './index.html')}`,
        windowSettings: {},
    });
}

app.allowRendererProcessReuse = true;

app.on('ready', main);

DataHandler.fetchAllPlaylists().then(d => {
    ipcMain.on('FETCH_PLAYLIST_EXPLORER', (e, arg) => {
        console.log('HELLO', arg);
        e.reply('FETCH_PLAYLIST_EXPLORER', d);
    });
});
