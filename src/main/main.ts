import { app, dialog } from 'electron';

import { Window } from './Window';
import { DataHandler } from './DataHandler';
import { handleEvent } from './Ipc';
import { saveSongs } from './helpers';

app.allowRendererProcessReuse = true;

let win: Window;

async function main() {
    await DataHandler.startup();
    
    const initialState = await DataHandler.setup();

    win = new Window({
        file: `file://${__dirname}/index.html`,
        windowSettings: {},
    });

    win.send('FETCH_STATE', initialState);
}

app.on('ready', main);

handleEvent('FETCH_TREE', async () => {
    const result = await DataHandler.fetchTree();
    return result;
});

handleEvent('FETCH_STATE', async () => {
    const result = await DataHandler.fetchState();

    win.setSidebarOpen(result.show_explorer);

    return result;
});

handleEvent('UPDATE_STATE', async (_, args) => {
    try {
        await DataHandler.saveState(args);

        return true;
    } catch (err) {}
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

handleEvent('DELETE_SONG', async (_, args) => {
    if (args.length === 2) {
        const result = await DataHandler.deleteSong(args[0].id, args[1]);
        return result;
    }
});

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
