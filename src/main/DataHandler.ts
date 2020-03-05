import { Folder, Playlist, SqliteDAO, IPlaylist, ISong } from '../services/db';

interface ITreeItem {
    id: string;
    title: string;
    type: 'folder' | 'playlist';
    length: number;
    nested: (IPlaylist | ISong)[];
}

export class DataHandler {
    static fetchAllPlaylists = async () => {
        try {
            return Playlist.find(true, false);
        } catch (err) {
            throw new Error('ERROR: in fetchAllPlaylists');
        }
    };

    static async getTree(): Promise<ITreeItem[]> {
        const sql = `SELECT * FROM
        (
        SELECT f.id, f.title, "folder" as type, COUNT(*) length FROM folders f
        JOIN playlists p ON f.id = p.parent
        GROUP BY f.id
        
        UNION
        
        SELECT p.id, p.title, "playlist" as type, CASE WHEN sl.songs IS NULL THEN 0 ELSE songs END as length FROM playlists p
        LEFT OUTER JOIN (
        SELECT COUNT(song_id) songs, playlist_id  FROM playlist_song_list
        GROUP BY playlist_id
        ) sl 
        ON sl.playlist_id = p.id
        WHERE p.parent != 1
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
