import { Playlist } from '../services/db';

export class DataHandler {
    constructor() {}

    static fetchAllPlaylists = async () => {
        try {
            const rootPlaylists = await Playlist.find(true, true);
            return rootPlaylists;
        } catch (err) {
            throw new Error('ERROR: in fetchAllPlaylists');
        }
    };
}
