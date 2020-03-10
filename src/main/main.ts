import { app, dialog } from 'electron';
import path from 'path';
import { Window } from './Window';
import { DataHandler } from './DataHandler';
import { handleEvent } from './Ipc';
import { parseFileName } from './helpers';
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

handleEvent('DELETE_SONG', async (_, args) => {
    console.log(args);
    if (args.length === 2) {
        const result = await DataHandler.deleteSong(args[0].id, args[1]);
        return result;
    }
});

handleEvent('FETCH_TREE', async () => {
    const result = await DataHandler.fetchTree();
    return result;
});

handleEvent('FETCH_PLAYLISTS', async () => {
    const result = await DataHandler.fetchPlaylists();
    return result;
});

handleEvent('FETCH_PLAYLIST', async (_, id) => {
    const result = await DataHandler.fetchPlaylists(id);
    return result;
});

handleEvent('SAVE_PLAYLIST', async (_, title) => {
    const id = await DataHandler.createPlaylist(title);
    return id;
});

handleEvent('UPDATE_PLAYLIST', async (_, title) => {
    await DataHandler.updatePlaylist(title);
    // return id;
});

handleEvent('ADD_SONG', async (_, args) => {
    // try {
    return new Promise((resolve, reject) => {
        dialog
            .showOpenDialog({
                title: 'Add Song To Playlist',
                properties: ['openFile', 'multiSelections'],
                filters: [{ name: 'Audio Files', extensions: ['mp3'] }],
            })
            .then(res => {
                if (res.filePaths.length) {
                    ffmpeg.ffprobe(res.filePaths[0], async (_, data) => {
                        DataHandler.createSong(
                            parseFileName(data?.format?.filename),
                            (data?.format?.duration || 0) * 1000,
                            res.filePaths?.[0],
                            args.playlistId,
                            args.index
                        )
                            .then(newSongId => {
                                DataHandler.findSong(newSongId)
                                    .then(song => {
                                        resolve(song);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            })
                            .catch(err => {
                                reject(err);
                            });
                    });
                }
            })
            .catch(err => {
                reject(err);
            });
    });
    // } catch (_) {}
});
