import { Model } from './Model';
import { IFolder } from './../interfaces';
import { SqliteDAO, IPlaylist } from '..';

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
                this.logInfo('find', { data: folders });
                return folders;
            }

            const promises = folders.map(folder =>
                this.findItems<IPlaylist>(folder.id?.toString() || '')
            );
            const nested = await Promise.all(promises);

            const data = [];

            for (let i = 0; i < folders.length; i++) {
                const withNested = {
                    ...folders[i],
                    length: nested[i].length,
                    nested: nested[i],
                };
                data.push(withNested);
            }

            this.logInfo('find', { data });

            return data;
        } catch (error) {
            this.logError('find', { error });
            throw new Error(error.text);
        }
    }

    static findItems<IPlaylist>(folderId: string): Promise<IPlaylist[]> {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT a.*, b.title as root_folder_title FROM playlists a
            JOIN folders b ON b.id = a.parent
            WHERE b.id = ?
      `;

            SqliteDAO.all<IPlaylist>(sql, [folderId])
                .then(data => {
                    this.logInfo('findItem', { data });
                    resolve(data);
                })
                .catch(error => {
                    this.logError('findItems', { error });
                    reject(error);
                });
        });
    }
}
