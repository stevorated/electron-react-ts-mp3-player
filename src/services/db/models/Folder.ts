import { Model } from './Model';
import { IFolder } from './../interfaces';
import { SqliteDAO, Playlist, IPlaylist } from '..';

export class Folder extends Model {
    static async find(
        withNested?: boolean,
        root?: boolean,
        playlistId?: string
    ): Promise<IFolder[]> {
        let where = '';
        if (playlistId) {
            where = 'WHERE id = ?';
        } else if (root) {
            where = 'WHERE parent IS null';
        }
        const sql1 = `SELECT * FROM playlists ${where};`;

        try {
            const folders = await SqliteDAO.all<IFolder>(sql1, []);

            if (!withNested) {
                return folders;
            }

            const promises = folders.map(folder => Playlist.find(false, false));
            const songs = await Promise.all(promises);

            const res = [];

            for (let i = 0; i < folders.length; i++) {
                const recordWithSongs = { ...folders[i], songs: songs[i] };
                res.push(recordWithSongs);
            }

            return res;
        } catch (err) {
            throw new Error(err.text);
        }
    }

    static async findItems<IPlaylist>(
        folderId: string,
        playlistId?: string
    ): Promise<IPlaylist[]> {
        let where = '';
        let sql = '';
        let params;
        where = ' WHERE folder_id = ? AND playlist_id = ?';
        params = [folderId, playlistId];
        
        if (playlistId) {
            where = ' WHERE folder_id = ? AND playlist_id = ?';
            params = [folderId, playlistId];
        } else {
            where = ' WHERE folder_id = ? ';
            params = [folderId];
        }

        sql = `
        SELECT a.*, b.title as root_folder_type FROM playlists a
        JOIN folders b ON b.id = a.parent
        WHERE b.id = ?
  `;

        try {
            if (playlistId) {
                const res = await SqliteDAO.all<IPlaylist>(sql, params);

                return res;
            } else {
                const res = await SqliteDAO.all<IPlaylist>(sql, params);

                return res;
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
