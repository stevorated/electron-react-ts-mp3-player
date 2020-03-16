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

handleEvent('SAVE_PLAYLIST', async (_, title) => {
    console.log(title);
    const id = await DataHandler.createPlaylist(title);
    return id;
});

handleEvent('UPDATE_PLAYLIST', async (_, title) => {
    await DataHandler.updatePlaylist(title);
    // return id;
});

handleEvent('ADD_SONG', async (_, args) => {
    try {
        const dialogData = await dialog.showOpenDialog({
            title: 'Add Song To Playlist',
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3'] }],
        });

        if (dialogData.filePaths?.length === 1) {
            const [filePath] = dialogData.filePaths;

            const { format } = await parseMp3(filePath);
            const newSongId = await DataHandler.createSong(
                parseFileName(format.filename),
                (format.duration || 0) * 1000,
                filePath,
                args.playlistId,
                args.index
            );

            return DataHandler.findSongById(newSongId);
        }
        if (dialogData.filePaths?.length > 1) {
            const filePaths = dialogData.filePaths;

            const probes = await Promise.all(
                filePaths.map(filePath => {
                    return parseMp3(filePath);
                })
            );

            const songsIdsPromises = probes.map(({ format }, index) => {
                return DataHandler.createSong(
                    parseFileName(format.filename),
                    (format.duration || 0) * 1000,
                    filePaths[index],
                    args.playlistId,
                    args.index + index
                );
            });

            const songIds = await Promise.all(songsIdsPromises);
            const res = await Promise.all(
                songIds.map(id => {
                    return DataHandler.findSongById(id);
                })
            );

            return res.map(([item]) => item);
        }
    } catch (err) {
        console.log(err);
    }
});

handleEvent('UPDATE_SONG', async (_, args) => {
    try {
        await DataHandler.updateSong(args);
        return true;
    } catch (error) {
        return false;
    }
});

handleEvent('DELETE_PLAYLIST', async (_, args) => {
    try {
        await DataHandler.deletePlaylist(args);
        return true;
    } catch (err) {
        return false;
    }
});

const parseMp3 = (path: string): Promise<ffmpeg.FfprobeData> =>
    new Promise(resolve => {
        ffmpeg.ffprobe(path, (_, data) => {
            resolve(data);
        });
    });
