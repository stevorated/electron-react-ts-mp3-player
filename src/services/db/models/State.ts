import { Model } from './Model';
import { SqliteDAO } from '..';
import { IState } from '../interfaces';

export class State extends Model {
    static findOne(id?: number): Promise<IState> {
        return new Promise((resolve, reject) => {
            let where = '';
            const params: string[] = [];

            if (id) {
                where = 'WHERE id = ?';
                params.push(id.toString());
            }

            const sql = `SELECT * FROM ${this.name}s ${where} ORDER BY id DESC;`;

            SqliteDAO.get<IState>(sql, params)
                .then(data => {
                    this.logInfo('findOne', { data, sql, params });

                    const {
                        id,
                        volume,
                        wait_between,
                        show_explorer,
                        random,
                        current_playlist_id,
                        loop,
                        is_prefs_open,
                        canvas_type,
                        fft_size,
                        created_at,
                    } = data;

                    resolve({
                        id,
                        volume,
                        wait_between,
                        show_explorer: show_explorer ? true : false,
                        random: random ? true : false,
                        current_playlist_id,
                        loop: loop ? true : false,
                        is_prefs_open: is_prefs_open ? true : false,
                        canvas_type,
                        fft_size,
                        created_at,
                    });
                })
                .catch(error => {
                    this.logError('findOne', { error });
                    reject(error);
                });
        });
    }

    static find(songId?: number): Promise<IState[]> {
        return new Promise((resolve, reject) => {
            let where = '';
            const params: string[] = [];
            if (songId) {
                where = 'WHERE id = ?';
                params.push(songId.toString());
            }
            const sql = `SELECT * FROM ${this.name}s ${where} ORDER BY id;`;

            SqliteDAO.all<IState>(sql, params)
                .then(data => {
                    this.logInfo('find', { data, sql, params });

                    resolve(data);
                })
                .catch(error => {
                    this.logError('find', { error });
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
