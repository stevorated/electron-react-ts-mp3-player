import 'source-map-support/register';
import { SqliteDAO } from './SqliteDAO';
import { Playlist, ISong, Song } from './index';
import { Words } from './utils';

// SqliteDAO.connect();
SqliteDAO.setup();
SqliteDAO.setup();

// Playlist.find().then(data => {
//     // console.log(data);
// });

// const make = async () => {
//     const pls = await Playlist.find();

//     if (!pls) {
//         return [];
//     }

//     const promises = pls.map(pl => Playlist.findItems(pl.id || ''));

//     const songs = (await Promise.all(promises)) as ISong[][];

//     const res = [];
//     for (let i = 0; i < pls.length; i++) {
//         const x = { ...pls[i], songs: songs[i] };
//         res.push(x);
//     }

//     return res;
// };

// make().then(data => console.log(data));

const createRandomSong = async () => {
    const song = await Song.create<ISong>(Words.createRandomSongObject());
};

const createRandomPlaylist = async () => {
    const playlist = await Playlist.create({
        title: Words.generate(2),
        parent: 3,
    }).then(data => console.log(data.lastID));
};

// createRandomSong();
// createRandomSong();
// createRandomSong();
// createRandomSong();
// createRandomSong();
// createRandomPlaylist();
// Playlist.popItem('1', '1');
Playlist.find(false, true).then(data => console.log(data));
// Playlist.pushItem('5', '3', '5').then(data => console.log(data));

setTimeout(() => {
    SqliteDAO.close();
}, 1000);
