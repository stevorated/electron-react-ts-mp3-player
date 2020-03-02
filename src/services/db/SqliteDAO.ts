import sqlite3, { Database, RunResult } from 'sqlite3';
import { Connector } from './Connector';
import { startupSql } from './schema/sql';

sqlite3.verbose();

interface IDAO {
    connect: (dir: string, db: string) => Database | null;
    // close: () => boolean;
    // setup: () => Promise<boolean>;
}

export class SqliteDAO {
    static exec(sql: string, dontLog?: boolean) {
        return new Promise<boolean>((resolve, reject) => {
            Connector.getInstance().exec(sql, function(err) {
                if (err) {
                    if (!dontLog) {
                        console.log('Error running sql: ' + sql);
                        console.log(err);
                    }
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static get<T>(sql: string, params: string[]) {
        return new Promise<T>((resolve, reject) => {
            Connector.getInstance().get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static all<T>(sql: string, params: string[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            try {
                Connector.getInstance().all(sql, params, (err, result) => {
                    if (err) {
                        // console.log('Error running sql: ====> ' + sql);
                        // console.log(err);
                        // reject(err);
                    } else {
                        // console.log(result);
                        resolve(result);
                    }
                });
            } catch (err) {}
        });
    }

    static run(sql: string, params: (string | number)[]): Promise<RunResult> {
        return new Promise((resolve, reject) => {
            try {
                // console.log(Connector.getInstance().run(sql, params));
                Connector.getInstance().run(sql, params, function(err) {
                    if (err) {
                        reject(err);
                    }

                    resolve(this);
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    static execStatement(sql: string, params: (string | number)[]) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = Connector.getInstance().prepare(sql);

                stmt.run(params, function(err) {
                    if (err) {
                        reject(err);
                    }
                    // resolve(stmt);
                });

                stmt.finalize(() => {
                    resolve(stmt);
                });

                // SqliteDAO.close();
                // SqliteDAO.connect();
            } catch (err) {
                reject(err);
            }
        });
    }

    static async setup(): Promise<boolean> {
        try {
            startupSql.forEach(async query => {
                await this.exec(query);
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    static connect(): Database {
        return Connector.getInstance();
    }

    static close(): boolean {
        const conn = Connector.getInstance();
        if (!conn) {
            throw new Error(`[Error]: Can't connect to db`);
        }
        conn.close(err => {
            if (err) {
                return false;
            }
        });

        return true;
    }
}
