import path from 'path';
import electronLocalshortcut from 'electron-localshortcut';
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

import MenuBuilder from './Menu';
import { Channels } from '.';
import { Logger } from '../logger';

type Props = {
    file: string;
    windowSettings?: BrowserWindowConstructorOptions;
};

const defaultSettings: BrowserWindowConstructorOptions = {
    width: 1300,
    height: 800,
    minWidth: 1000,
    icon: path.join(__dirname, '/icon.png'),
    webPreferences: {
        nodeIntegration: true,
        preload: path.join('./bundle.min.js'),
        // webSecurity: false,
    },
};

export class Window extends BrowserWindow {
    private logger: Logger = new Logger('main');

    constructor({ file, windowSettings }: Props) {
        super({ ...defaultSettings, ...windowSettings });

        this.loadURL(file);
        if (process.env.NODE_ENV === 'development') {
            this.webContents.openDevTools();
        }

        const menuBuilder = new MenuBuilder(this);
        menuBuilder.buildMenu();

        electronLocalshortcut.register(this, 'Ctrl+P', () => {
            this.send('ACC_PLAY_PAUSE');
        });

        electronLocalshortcut.register(this, 'Right', () => {
            this.send('ACC_FF');
        });

        electronLocalshortcut.register(this, 'Left', () => {
            this.send('ACC_REWIND');
        });

        electronLocalshortcut.register(this, 'Down', () => {
            this.send('ACC_DOWN');
        });

        electronLocalshortcut.register(this, 'Up', () => {
            this.send('ACC_UP');
        });
    }

    send = (channel: Channels, ...args: any) => {
        this.logger.info(`Ipc Send - ${channel}`, { data: args });
        this.webContents.send(channel, ...args);
    };
}
