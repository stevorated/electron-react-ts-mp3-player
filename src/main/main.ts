import { app, dialog } from 'electron';
import { Window } from './Window';
import { DataHandler } from './DataHandler';
import { handleEvent } from './Ipc';
import { parseFileName, parseMp3 } from './helpers';

app.allowRendererProcessReuse = true;
async function main() {
    await DataHandler.startup();
    new Window({
        file: `file://${__dirname}/index.html`,
        windowSettings: {},
    });
}
    
app.on('ready', main);

handleEvent('DELETE_SONG', async (_, args) => {
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
    const id = await DataHandler.createPlaylist(title);
    return id;
});

handleEvent(
    'SORT_PLAYLIST',
    async (_, { songId, newIndex, currentPlaylistId }) => {
        await DataHandler.sortPlaylist(currentPlaylistId, songId, newIndex);

        return true;
    }
);

handleEvent('UPDATE_PLAYLIST', async (_, title) => {
    await DataHandler.updatePlaylist(title);
});

handleEvent('ADD_SONG', async (_, args) => {
    try {
        const dialogData = await dialog.showOpenDialog({
            title: 'Add Song To Playlist',
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3'] }],
        });
        return saveSongs(dialogData.filePaths, args.playlistId, args.index);
    } catch (err) {}
});

const saveSongs = async (
    paths: string[],
    playlistId: number,
    initialIndex: number
) => {
    console.log('saving songs');
    const probes = await Promise.all(
        paths.map(filePath => {
            return parseMp3(filePath);
        })
    );

    const songIdsPromises = probes.map(({ format }, index) => {
        return DataHandler.createSong(
            parseFileName(format.filename),
            (format.duration || 0) * 1000,
            paths[index],
            playlistId,
            initialIndex + index
        );
    });

    const songIds = await Promise.all(songIdsPromises);
    const res = await Promise.all(
        songIds.map(id => {
            return DataHandler.findSongById(id);
        })
    );

    return res.map(([song]) => song);
};

handleEvent('DROP_SONG', async (_, { paths, playlistId, index }) => {
    const songs = await saveSongs(paths, playlistId, index);
    return songs;
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
