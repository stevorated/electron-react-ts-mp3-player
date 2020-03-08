import 'source-map-support/register';
import { SqliteDAO } from './SqliteDAO';
import { Playlist, ISong, Song, Folder } from './index';
import { Words } from './utils';
import { startupSql, keys } from './schema/sql';

// SqliteDAO.connect();

SqliteDAO.setup(startupSql).then(d => console.log(d));
setTimeout(() => {
    SqliteDAO.setup(keys).then(d => console.log(d));
}, 1000);

const createRandomSong = async () => {
    const song = await Song.create<ISong>(
        Words.createRandomSongObject()
    ).then(data => console.log(data.lastID));
};

const createRandomPlaylist = () => {
    Playlist.create({
        title: Words.generate(2),
        // parent: 3,
    }).then(data => console.log(data.lastID));
};

const createFolder = (title: string) => {
    Folder.create({
        title,
    }).then(data => console.log(data.lastID));
};

setTimeout(() => {
    createRandomSong();
    createRandomSong();
    createRandomSong();
    createRandomSong();
    createRandomSong();
    createRandomPlaylist();
    createRandomPlaylist();
    createRandomPlaylist();
    createRandomPlaylist();
    Playlist.pushItem('1', '1', '1');
    Playlist.pushItem('1', '2', '1');
    Playlist.pushItem('1', '3', '1');
    Playlist.pushItem('1', '4', '1');
    Playlist.pushItem('2', '1', '2');
    Playlist.pushItem('2', '2', '2');
    Playlist.pushItem('2', '3', '2');
    Playlist.pushItem('2', '4', '2');
    Playlist.pushItem('3', '1', '3');
    Playlist.pushItem('3', '2', '3');
    Playlist.pushItem('3', '3', '3');
    Playlist.pushItem('3', '4', '3');
    Playlist.pushItem('4', '1', '4');
    Playlist.pushItem('4', '2', '4');
    Playlist.pushItem('4', '3', '4');
    Playlist.pushItem('4', '4', '4');
}, 2000);

setTimeout(() => {
    SqliteDAO.close();
    console.log('SUCCESS');
}, 3000);
