import { app, ipcMain } from 'electron';
import path from 'path';
import { MainWindow } from './MainWindow';
import { DataHandler } from './DataHandler';

// require('electron-reload')(__dirname);

function main() {
    const mainWindow = new MainWindow({
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
