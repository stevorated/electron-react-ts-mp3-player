import path from 'path';

import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import MenuBuilder from './Menu';

type Props = {
    file: string;
    windowSettings?: BrowserWindowConstructorOptions;
};

const defaultSettings = {
    width: 1300,
    height: 800,
    minWidth: 1000,
    webPreferences: {
        nodeIntegration: false,
        preload: path.join('./dist/perload.js'),
    },
};

export class Window extends BrowserWindow {
    constructor({ file, windowSettings }: Props) {
        super({ ...defaultSettings, ...windowSettings });

        this.loadFile(file);
        if (process.env.NODE_ENV === 'development') {
            this.webContents.openDevTools();
        }

        this.once('ready-to-show', () => {
            this.show();
        });

        const menuBuilder = new MenuBuilder(this);
        menuBuilder.buildMenu();
    }
}
