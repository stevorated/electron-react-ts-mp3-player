import { app, dialog } from 'electron';
import path from 'path';
import { Window } from './Window';
import { DataHandler } from './DataHandler';
import { handleEvent } from './Ipc';
import ffmpeg from 'fluent-ffmpeg';

// require('electron-reload')(__dirname + './dist/electron.js');

app.allowRendererProcessReuse = true;
function main() {
    DataHandler.startup().then(() => {
        new Window({
            file: `${path.join(app.getAppPath(), './index.html')}`,
            windowSettings: {},
        });
    });
}

app.on('ready', main);

handleEvent('FETCH_TREE', async () => {
    const result = await DataHandler.fetchTree();
    return result;
});

handleEvent('FETCH_PLAYLISTS', async () => {
    const result = await DataHandler.fetchPlaylists();
    return result;
});

handleEvent('SAVE_PLAYLIST', async (_, title) => {
    const id = await DataHandler.createPlaylist(title);
    return id;
    // return result;
});

handleEvent('ADD_FILE_DIALOG', async (_, args) => {
    try {
        const res = await dialog.showOpenDialog({
            title: 'Add Song To Playlist',
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3'] }],
        });

        if (res.filePaths.length) {
            ffmpeg.ffprobe(res.filePaths[0], async (_, data) => {
                const song = await DataHandler.createSong(
                    parseFileName(data?.format?.filename),
                    (data?.format?.duration || 0) * 1000,
                    res.filePaths?.[0],
                    args.playlistId,
                    args.index
                );
                return song;
            });
        }
    } catch (_) {}
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
