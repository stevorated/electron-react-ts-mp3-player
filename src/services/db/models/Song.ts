import { Model } from './Model';
import { ISong } from './../interfaces';
import { SqliteDAO } from '../SqliteDAO';

export class Song extends Model {
    static find(songId?: number): Promise<ISong[]> {
        return new Promise((resolve, reject) => {
            let where = '';
            const params = [];
            if (songId) {
                where = 'WHERE id = ?';
                params.push(songId.toString());
            }
            const sql = `SELECT * FROM songs ${where};`;

            SqliteDAO.all<ISong>(sql, params)
                .then(data => {
                    this.logInfo('find', { data });

                    resolve(data);
                })
                .catch(error => {
                    this.logError('find', { error });
                    reject(error);
                });
        });
    }
}
