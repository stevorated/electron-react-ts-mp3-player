import {
    Folder,
    Playlist,
    SqliteDAO,
    IPlaylist,
    Song,
    ISong,
} from '../services/db';
import { OpenDialogReturnValue } from 'electron';

interface ITreeItem {
    id: string;
    title: string;
    type: 'folder' | 'playlist';
    length: number;
    nested: (IPlaylist | ISong)[];
}

export class DataHandler {
    static createPlaylist = async (title: string): Promise<any> => {
        const res = await Playlist.create({ title });
        return res.lastID;
    };

    static createSong = async (
        title: string,
        duration: number,
        path: string | string[],
        playlistId: number,
        index: number
    ): Promise<any> => {
        const res = await Song.create({ title, path, length: duration });
        await Playlist.pushItem(res.lastID, playlistId, index);
        return res.lastID;
    };

    static fetchPlaylists = async () => {
        try {
            return Playlist.find(true, false);
        } catch (err) {
            throw new Error('ERROR: in fetchAllPlaylists');
        }
    };

    static async fetchTree(): Promise<ITreeItem[]> {
        const sql = `SELECT * FROM
        (
        SELECT f.id, f.title, "folder" as type, COUNT(*) length FROM folders f
        JOIN playlists p ON f.id = p.parent
        WHERE f.id != 1
        GROUP BY f.id
        
        UNION
        
        SELECT p.id, p.title, "playlist" as type, CASE WHEN sl.songs IS NULL THEN 0 ELSE songs END as length FROM playlists p
        LEFT OUTER JOIN (
        SELECT COUNT(song_id) songs, playlist_id  FROM playlist_song_list
        GROUP BY playlist_id
        ) sl 
        ON sl.playlist_id = p.id
        WHERE p.parent IS NULL
        )
        ORDER BY type`;

        try {
            const raw = await SqliteDAO.all<ITreeItem>(sql, []);
            const promises = raw.map(item => {
                if (item.type === 'folder') {
                    return Folder.findItems<IPlaylist>(item.id);
                } else {
                    return Playlist.findItems<ISong>(item.id);
                }
            });

            const nested = await Promise.all<(ISong | IPlaylist)[]>(promises);
            const res: ITreeItem[] = [];

            for (let i = 0; i < raw.length; i++) {
                res.push({
                    ...raw[i],
                    nested: nested[i],
                });
            }

            return res;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
