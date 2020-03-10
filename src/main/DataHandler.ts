import {
    Folder,
    Playlist,
    SqliteDAO,
    IPlaylist,
    Song,
    ISong,
    startup,
} from '../services/db';

import { Logger } from '../logger';

interface ITreeItem {
    id: string;
    title: string;
    type: 'folder' | 'playlist';
    length: number;
    nested: (IPlaylist | ISong)[];
}

export class DataHandler {
    private static logger = new Logger('main');
    static async startup() {
        const res = startup();
        this.logger.info('called startup');
        return res;
    }

    static async createPlaylist(title: string): Promise<any> {
        const res = await Playlist.create({ title });
        this.logger.info('playlist created', [res]);
        return res.lastID;
    }

    static async updatePlaylist(payload: Partial<IPlaylist>): Promise<any> {
        if (!payload.id || !payload) {
            return;
        }

        const { title } = payload;
        const res = await Playlist.updateById<IPlaylist>(payload?.id, {
            title,
        });

        return res;
    }

    static async findSong(id?: number) {
        try {
            const song = await Song.find(id);

            this.logger.info('fetched song', [song]);
            return song;
        } catch (err) {
            this.logger.error(err.message);
            throw new Error(err.message);
        }
    }

    static async deleteSong(id: number, playlistId: number) {
        Playlist.popItem(playlistId.toString(), id.toString());
    }

    static async createSong(
        title: string,
        duration: number,
        path: string | string[],
        playlistId: number,
        index: number
    ): Promise<any> {
        try {
            const res = await Song.create({ title, path, length: duration });
            this.logger.info('created Song ', [res]);
            await Playlist.pushItem(res.lastID, playlistId, index);
            return res.lastID;
        } catch (err) {
            this.logger.error(err.message, err);
            throw new Error(err.message);
        }
    }

    static async fetchPlaylists(id?: number) {
        try {
            let res: IPlaylist[];
            if (id) {
                res = await Playlist.find(true, false, id);
            } else {
                res = await Playlist.find(true, false);
            }
            this.logger.info('fetched Playlist', res);
            return res;
        } catch (err) {
            this.logger.error(err.message, err);
            throw new Error('ERROR: in fetchAllPlaylists');
        }
    }

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

            this.logger.info('fetched Tree', res);

            return res;
        } catch (err) {
            this.logger.error(err.message, err);
            throw new Error(err.message);
        }
    }
}
