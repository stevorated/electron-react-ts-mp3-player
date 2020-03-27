import { Model } from './Model';
import { SqliteDAO } from '..';
import { IPrefs } from '../interfaces';

export class Preference extends Model {
    static find(songId?: number): Promise<IPrefs[]> {
        return new Promise((resolve, reject) => {
            let where = '';
            const params = [];

            if (songId) {
                where = 'WHERE id = ?';
                params.push(songId.toString());
            }

            const sql = `SELECT * FROM ${this.name}s ${where};`;

            SqliteDAO.all<IPrefs>(sql, params)
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

    static findOne(id?: number): Promise<IPrefs> {
        return new Promise((resolve, reject) => {
            let where = '';
            const params = [];

            if (id) {
                where = 'WHERE id = ?';
                params.push(id.toString());
            }

            const sql = `SELECT * FROM ${this.name}s ${where} ORDER BY id DESC;`;

            SqliteDAO.get<IPrefs>(sql, params)
                .then(data => {
                    this.logInfo('findOne', { data });

                    resolve(data);
                })
                .catch(error => {
                    this.logError('findOne', { error });
                    reject(error);
                });
        });
    }

    static count(): Promise<number> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) as count FROM ${this.name}s ORDER BY id;`;

            SqliteDAO.get<{ count: number }>(sql, [])
                .then(({ count }) => {
                    this.logInfo('count', { count, sql });

                    resolve(count);
                })
                .catch(error => {
                    this.logError('count', { error });
                    reject(error);
                });
        });
    }
}
