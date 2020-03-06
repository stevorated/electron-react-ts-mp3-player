import { Model } from './Model';
import { IFolder, ISong } from './../interfaces';
import { SqliteDAO, Playlist, IPlaylist } from '..';

export class Folder extends Model {
    static async find(
        withNested?: boolean,
        folderId?: string
    ): Promise<IFolder[]> {
        let where = '';
        if (folderId) {
            where = 'WHERE id = ?';
        }

        const sql1 = `SELECT * FROM folders ${where};`;

        try {
            const folders = folderId
                ? await SqliteDAO.all<IFolder>(sql1, [folderId])
                : await SqliteDAO.all<IFolder>(sql1, []);
            if (!withNested) {
                return folders;
            }

            const promises = folders.map(folder =>
                this.findItems<IPlaylist>(folder.id?.toString() || '')
            );
            const nested = await Promise.all(promises);

            const res = [];

            for (let i = 0; i < folders.length; i++) {
                const withNested = {
                    ...folders[i],
                    length: nested[i].length,
                    nested: nested[i],
                };
                res.push(withNested);
            }

            return res;
        } catch (err) {
            throw new Error(err.text);
        }
    }

    static async findItems<IPlaylist>(folderId: string): Promise<IPlaylist[]> {
        const sql = `
        SELECT a.*, b.title as root_folder_title FROM playlists a
        JOIN folders b ON b.id = a.parent
        WHERE b.id = ?
  `;

        try {
            return SqliteDAO.all<IPlaylist>(sql, [folderId]);
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
