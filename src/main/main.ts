import { app, ipcMain } from 'electron';
import path from 'path';
import { Window } from './Window';
import { DataHandler } from './DataHandler';

// require('electron-reload')(__dirname);

function main() {
    const mainWindow = new Window({
        file: `${path.join(app.getAppPath(), './index.html')}`,
        windowSettings: {},
    });
    // new Window({
    //     file: `${path.join(app.getAppPath(), './index/#blabla.html')}`,
    //     windowSettings: { width: 500, height: 500 },
    // });
}

app.allowRendererProcessReuse = true;

app.on('ready', main);

DataHandler.fetchAllPlaylists().then(d => {
    ipcMain.on('FETCH_PLAYLIST_EXPLORER', (e, arg) => {
        e.reply('FETCH_PLAYLIST_EXPLORER', d);
    });
});

DataHandler.getTree().then(d => {
    ipcMain.on('FETCH_TREE', (e, arg) => {
        e.reply('FETCH_TREE', d);
    });
});

DataHandler.getTree().then(d => {
    const action = 'OPEN_SETTINGS';
    ipcMain.on('OPEN_SETTINGS', (e, arg) => {
        e.reply('OPEN_SETTINGS', d);
    });
});
