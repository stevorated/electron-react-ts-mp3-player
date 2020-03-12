import { SqliteDAO } from '..';
import { RunResult } from 'sqlite3';
import { Logger } from '../../../logger';

export abstract class Model {
    private static logger = new Logger('database');

    public static logWarn(desc: string, meta: any) {
        this.logger.warn(`${this.name.toLowerCase()} ${desc} `, meta);
    }

    public static logError(desc: string, meta: any) {
        this.logger.error(`${this.name.toLowerCase()} ${desc} `, meta);
    }

    public static logInfo(desc: string, meta: any) {
        this.logger.info(`${this.name.toLowerCase()} ${desc} `, meta);
    }

    static async create<T>(entity: T): Promise<RunResult> {
        return new Promise((resolve, reject) => {
            let fields = '(';
            let values = 'VALUES (';
            const entries = Object.entries(entity);
            const params = Object.values(entity);
            for (let i = 0; i < entries.length; i++) {
                fields += `"${entries[i][0]}"`;
                values += ` ?`;
                if (i !== entries.length - 1) {
                    fields += ', ';
                    values += ', ';
                } else {
                    fields += ')';
                    values += ')';
                }
            }

            const sql = `INSERT INTO ${this.name.toLowerCase()}s ${fields} ${values};`;

            SqliteDAO.run(sql, params)
                .then(data => {
                    this.logInfo('create', { data });
                    resolve(data);
                })
                .catch((error: Error) => {
                    this.logError('create', { error });
                    reject(error);
                });
        });
    }

    static async updateById<T>(
        id: number,
        payload: Partial<Record<keyof T, number | string>>
    ): Promise<RunResult> {
        return new Promise((resolve, reject) => {
            if (Object.values(payload).length === 0) {
                const msg = 'no payload';
                this.logWarn('updateById', { data: msg });
                reject(new Error(msg));
            }
            let fields = '';

            const where = `id = ?`;
            const keys = Object.keys(payload);
            const params = Object.values(payload) as (string | number)[];

            if (keys.length === 0) {
                const msg = 'cannot updateById without payload';
                this.logWarn('updateById', { data: msg });
                reject(new Error(msg));
            }

            for (let i = 0; i < keys.length; i++) {
                fields += `"${keys[i]}" = ?`;

                if (i !== keys.length - 1) {
                    fields += ', ';
                }
            }

            const sql = `UPDATE ${this.name.toLowerCase()}s SET ${fields} WHERE ${where};`;

            SqliteDAO.run(sql, [...params, id])
                .then(data => {
                    this.logInfo('updateById', { data });
                    resolve(data);
                })
                .catch(error => {
                    this.logError('updateById', { error });
                    reject(error);
                });
        });
    }

    static async update<T>(
        by: Record<string, string | number>,
        payload: Partial<T>
    ): Promise<RunResult> {
        return new Promise((resolve, reject) => {
            if (Object.keys(payload).length === 0) {
                this.logger.warn(`${this.name.toLowerCase()}s no payload`);
                reject('no payload!');
            }
            let fields = '';
            let where = 'WHERE ';

            const whereKeys = Object.keys(by);
            const whereValues = Object.values(by);

            for (let i = 0; i < whereKeys.length; i++) {
                where += `${whereKeys[i]} = ? `;
                if (i < whereKeys.length - 1) {
                    where += 'AND ';
                }
            }

            const keys = Object.keys(payload);
            const params = Object.values(payload) as (string | number)[];

            if (keys.length === 0) {
                throw new Error('[Error]: cannot update without payload');
            }

            for (let i = 0; i < keys.length; i++) {
                fields += `"${keys[i]}" = ?`;

                if (i !== keys.length - 1) {
                    fields += ', ';
                }
            }

            const sql = `UPDATE ${this.name.toLowerCase()}s SET ${fields} ${
                where !== 'WHERE ' ? where : ''
            };`;

            SqliteDAO.run(sql, [...params, ...whereValues])
                .then(data => {
                    this.logInfo('update', { data });
                    resolve(data);
                })
                .catch(error => {
                    this.logError('update', { error });
                    reject(error);
                });
        });
    }

    static async removeById(id: number): Promise<RunResult> {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${this.name.toLowerCase()}s WHERE id = ?;`;

            SqliteDAO.run(sql, [id])
                .then(data => {
                    this.logInfo('removeById', { data });
                    resolve(data);
                })
                .catch(error => {
                    this.logError('removeById', { error });
                    reject(error);
                });
        });
    }

    static async remove(by: Record<string, string | number>) {
        return new Promise((resolve, reject) => {
            let where = 'WHERE ';

            const keys = Object.keys(by);

            for (let i = 0; i < keys.length; i++) {
                where += `${keys[i]} = ? `;
                if (i < keys.length - 1) {
                    where += 'AND ';
                }
            }

            const sql = `DELETE FROM ${this.name.toLowerCase()}s ${
                where !== 'WHERE ' ? where : ''
            };`;

            SqliteDAO.run(sql, Object.values(by))
                .then(data => {
                    this.logInfo('remove', { data });
                    resolve(data);
                })
                .catch(error => {
                    this.logError('remove', { error });
                    reject(error);
                });
        });
    }
}
