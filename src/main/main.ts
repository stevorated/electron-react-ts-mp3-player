import { app, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { Window } from './Window';
import { DataHandler } from './DataHandler';
import { handleEvent } from './Ipc';
import ffmpeg from 'fluent-ffmpeg';

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
    return new Promise((resolve, reject) => {
        console.log('ADD_FILE_DIALOG INVOKED', args);
        dialog
            .showOpenDialog({
                title: 'Add Song To Playlist',
                properties: ['openFile', 'multiSelections'],
                filters: [{ name: 'Audio Files', extensions: ['mp3'] }],
            })
            .then(res => {
                ffmpeg.ffprobe(res.filePaths[0], async (err, data) => {
                    if (err) {
                        reject(err);
                    }

                    await DataHandler.createSong(
                        parseFileName(data?.format.filename),
                        (data.format.duration || 0) * 1000,
                        res.filePaths?.[0],
                        args.playlistId,
                        args.index
                    );
                    resolve(res);
                });
            });
    });
});

const parseFileName = (filename?: string) => {
    if (!filename) {
        return 'unnamed';
    }
    let arr: string[] = [];
    // console.log(filename.split('/'));
    // console.log(filename.split('\\').length);
    if (filename.split('/').length > 1) {
        arr = filename.split('/');
    } else if (filename.split('\\').length > 1) {
        arr = filename.split('\\');
    }

    const [songNameWithExt] = arr.reverse();

    const [songName] = songNameWithExt.split('.');

    return songName;
};

parseFileName('C:\\Users\\garbe\\Desktop\\album\\album_1\\War Master.mp3');
