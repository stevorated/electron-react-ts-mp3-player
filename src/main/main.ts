import { app } from 'electron';
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

// DataHandler.fetchAllPlaylists().then(d => {
//     console.log(d);
// });

// import { app, BrowserWindow } from 'electron';
// declare var __dirname: string;
// let mainWindow: Electron.BrowserWindow;

// function onReady() {
//     mainWindow = new BrowserWindow({
//         width: 800,
//         height: 600,
//     });

//     const fileName = `./index.html`;
//     mainWindow.loadURL(fileName);
//     mainWindow.on('close', () => app.quit());
// }

// app.on('ready', () => onReady());
// app.on('window-all-closed', () => app.quit());
// console.log(`Electron Version ${app.getVersion()}`);
