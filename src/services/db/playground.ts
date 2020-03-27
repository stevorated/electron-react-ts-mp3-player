// import { Logger } from '../../logger';
// import { Folder } from './models';
// import { SqliteDAO } from './SqliteDAO';
// import { State } from './models';
// import { IPlaylist } from './interfaces';
// import { Playlist } from './models';
import { Query } from './utils/Query';

// logger.error('somthing of an bad situation');

// Folder.create('');

// logger.info('dsfdsfds');
// State.count().then(count => console.log(count));
// State.create<IState>({
//     volume: 0.5,
//     show_explorer: true,
//     random: true,
//     current_playlist_id: 1,
// })
//     .then(data => console.log(data))
//     .then(() => {
//         State.findOne().then(data => console.log(data));
//     });

// Playlist.create({
//     title: 'bla bla',
// });

// const item: Partial<IPlaylist> = {
//     title: 'bla bla',
//     playlist_index: 3,
//     parent: null,
// };

// console.log(Query.parseWhereClause<IPlaylist>(item));
// console.log(Query.parseFields<IPlaylist>(item));
// const { where, params } = Query.parseWheresAndNulls<IPlaylist>(item);

// console.log(where, params);

console.log(Query.parseInFilter([1, 2, 3, 4], 'playlist_id'));
