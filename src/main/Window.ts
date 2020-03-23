import path from 'path';

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

        this.once('ready-to-show', () => {
            this.show();
        });

        this.on('close', () => {
            // new Window({ file: '' });
        });

        const menuBuilder = new MenuBuilder(this);
        menuBuilder.buildMenu();
    }

    send = (channel: Channels, ...args: any) => {
        console.log(channel);
        this.logger.info(`Ipc Send - ${channel}`, { data: args });
        this.webContents.send(channel, ...args);
    };
}
