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
import { RunResult } from 'sqlite3';

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
        this.logger.info('playlist created', { data: res });
        return res.lastID;
    }

    static async updatePlaylist(
        payload: Partial<IPlaylist>
    ): Promise<RunResult | void> {
        if (!payload.id || !payload) {
            return;
        }

        const { title } = payload;
        const res = await Playlist.updateById<IPlaylist>(payload?.id, {
            title,
        });

        return res;
    }

    static async deletePlaylist(id: number): Promise<RunResult> {
        return Playlist.removeById(id);
    }

    static async findSongById(id?: number) {
        try {
            const data = await Song.find(id);

            this.logger.info('fetched song', { data });
            return data;
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
            const data = await Song.create({ title, path, length: duration });
            this.logger.info('created Song ', { data });
            await Playlist.pushItem(data.lastID, playlistId, index);
            return data.lastID;
        } catch (error) {
            this.logger.error(error.message, { error });
            throw new Error(error.message);
        }
    }

    static async updateSong(song: ISong) {
        try {
            const res = await Song.updateById(song?.id || -2, {
                title: song.title,
            });
            return res;
        } catch (error) {
            throw new Error(error.text);
        }
    }

    static async fetchPlaylists(id?: number) {
        try {
            let data: IPlaylist[];
            if (id) {
                data = await Playlist.find(true, false, id);
            } else {
                data = await Playlist.find(true, false);
            }
            this.logger.info('fetched Playlist', { data });
            return data;
        } catch (error) {
            this.logger.error(error.message, { error });
            throw new Error('ERROR: in fetchAllPlaylists');
        }
    }

    static async fetchTree(): Promise<ITreeItem[]> {
        const sql = `SELECT * FROM
        (
        SELECT f.id, f.title, "folder" as type, COUNT(*) length FROM folders f
        LEFT JOIN playlists p ON f.id = p.parent
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

            this.logger.info('fetched Tree', { data: res });

            return res;
        } catch (err) {
            this.logger.error(err.message, { error: err });
            throw new Error(err.message);
        }
    }
}
