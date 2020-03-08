import { SqliteDAO } from '..';
import { Statement, RunResult } from 'sqlite3';

export abstract class Model {
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
                    console.log(data);
                    resolve(data);
                })
                .catch(e => {
                    console.log(e);
                    reject(e);
                });
        });
    }

    static async updateById<T>(
        id: number,
        payload: Partial<Record<keyof T, number | string>>
    ) {
        if (Object.values(payload).length === 0) {
            throw new Error('[Error]: cannot run update with empty payload');
        }
        let fields = '';

        const where = `id = ?`;
        const keys = Object.keys(payload);
        const params = Object.values(payload) as (string | number)[];

        if (keys.length === 0) {
            throw new Error('[Error]: cannot updateById without payload');
        }

        for (let i = 0; i < keys.length; i++) {
            fields += `"${keys[i]}" = ?`;

            if (i !== keys.length - 1) {
                fields += ', ';
            }
        }

        const sql = `UPDATE ${this.name.toLowerCase()}s SET ${fields} WHERE ${where};`;

        await SqliteDAO.run(sql, [...params, id]);
    }

    static async update<T>(
        by: Record<string, string | number>,
        payload: Partial<T>
    ) {
        if (Object.keys(payload).length === 0) {
            throw new Error();
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

        await SqliteDAO.run(sql, [...params, ...whereValues]);
    }

    static async removeById(id: number) {
        const sql = `DELETE FROM ${this.name.toLowerCase()}s WHERE id = ?;`;

        await SqliteDAO.run(sql, [id]);
    }

    static async remove(by: Record<string, string | number>) {
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

        await SqliteDAO.run(sql, Object.values(by));
    }
}
