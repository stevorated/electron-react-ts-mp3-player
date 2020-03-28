import { Model } from './Model';
import { ISong, IPlaylist } from '../interfaces';
import { SqliteDAO } from '../SqliteDAO';
import { Connector } from '../Connector';

export class Playlist extends Model {
    static async pushItem(
        songId: string,
        playlistId: string,
        index: string
    ): Promise<boolean> {
        SqliteDAO.execStatement(
            `
      INSERT INTO playlist_song_list (song_id, playlist_id, song_index) VALUES (?, ?, ?);
    `,
            [songId, playlistId, index]
        );

        return true;
    }

    static async find(
        withSongs?: boolean,
        root?: boolean,
        playlistId?: string
    ) {
        let where = '';
        if (playlistId) {
            where = 'WHERE id = ?';
        } else if (root) {
            where = 'WHERE parent IS null';
        }
        const sql1 = `SELECT * FROM playlists ${where};`;

        try {
            const pls = await SqliteDAO.all<IPlaylist>(sql1, []);

            if (!withSongs) {
                return pls;
            }

            const promises = pls.map(pl => Playlist.findItems(pl.id || ''));
            const songs = await Promise.all(promises);

            const res = [];

            for (let i = 0; i < pls.length; i++) {
                const recordWithSongs = { ...pls[i], songs: songs[i] };
                res.push(recordWithSongs);
            }

            return res;
        } catch (err) {
            throw new Error(err.text);
        }
    }

    static async findItems<ISong>(
        playlistId: string,
        songId?: string
    ): Promise<ISong[] | ISong> {
        let where = '';
        let sql = '';
        let params;
        if (songId) {
            where = ' WHERE playlist_id = ? AND song_id = ?';
            params = [playlistId, songId];
        } else {
            where = ' WHERE playlist_id = ? ';
            params = [playlistId];
        }

        sql = `
        SELECT a.*, b.song_index FROM songs a JOIN (
        SELECT song_id, song_index FROM playlist_song_list ${where}
        ) b ON a.id = b.song_id
      `;

        try {
            if (songId) {
                const res = (await SqliteDAO.all<ISong>(sql, params))[0];

                return res;
            } else {
                const res = await SqliteDAO.all<ISong>(sql, params);

                return res;
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async countItems(playlistId: string): Promise<number> {
        try {
            const { count } = (await SqliteDAO.get(
                `
        SELECT COUNT(*) count FROM playlist_song_list WHERE playlist_id = ? ;
      `,
                [playlistId]
            )) as { count: number };

            return count;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async popItem(playlistId: string, songId: string): Promise<boolean> {
        try {
            const res = await SqliteDAO.get<{ sid: number } | null>(
                `
        SELECT song_index as sid FROM playlist_song_list 
        WHERE song_id = ? AND playlist_id = ?;
      `,
                [songId, playlistId]
            );

            console.log('songIndex: ', res?.sid);

            if (!res?.sid) {
                throw new Error('Record Not Found');
            }

            await SqliteDAO.execStatement(
                `
        DELETE FROM playlist_song_list WHERE playlist_id = ? AND song_id = ? ;
      `,
                [playlistId, songId]
            );

            await SqliteDAO.run(
                `
        UPDATE playlist_song_list 
        SET song_index = CASE 
        WHEN song_index > ?
        THEN song_index - 1 ELSE song_index END 
        WHERE playlist_id = ? 
        `,
                [res.sid, playlistId]
            );

            return true;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async swap(playlistId: string, songId: string, newIndex: string) {
        try {
            await SqliteDAO.run(
                `
        UPDATE playlist_song_list 
        SET song_index = CASE 
        WHEN song_index <= 
        (SELECT song_index FROM playlist_song_list WHERE playlist_id = ? AND song_id = ?) 
        
        THEN song_index + 1 ELSE song_index END 
        WHERE playlist_id = ? 
        AND song_index >= ? 
        AND song_id <> ? ;
        `,
                [playlistId, songId, playlistId, newIndex, songId]
            );

            await SqliteDAO.run(
                `
        UPDATE playlist_song_list
        SET song_index = ?
        WHERE song_id = ?
        AND playlist_id = ?;
      `,
                [newIndex, songId, playlistId]
            );

            return true;
        } catch (error) {
            return false;
        }
    }
}
