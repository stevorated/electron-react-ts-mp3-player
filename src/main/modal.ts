import path from 'path';

import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import MenuBuilder from './Menu';

type Props = {
    file: string;
    windowSettings?: BrowserWindowConstructorOptions;
};

const defaultSettings = {
    width: 600,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        preload: path.join('./dist/perload.js'),
    },
};

export class Modal extends BrowserWindow {
    constructor({ file, windowSettings }: Props) {
        super({ ...defaultSettings, ...windowSettings });

        this.loadFile(file);
        if (process.env.NODE_ENV === 'development') {
            // this.webContents.openDevTools();
        }

        this.once('ready-to-show', () => {
            this.hide();
        });

        this.on('close', e => {
            e.preventDefault();
            this.hide();
            // new Window({ file: '' });
        });
        

        const menuBuilder = new MenuBuilder(this);
        menuBuilder.buildMenu();
    }
}
