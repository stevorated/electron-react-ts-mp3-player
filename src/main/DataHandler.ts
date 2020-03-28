import { Playlist } from '../services/db';

export class DataHandler {
    constructor() {}

    static fetchAllPlaylists = async () => {
        try {
            const rootPlaylists = await Playlist.find(false, true);
            console.log(rootPlaylists);
            return rootPlaylists;
        } catch (err) {
            console.log('ERROR');
        }
        console.log('YA ALLA');
    };
}
