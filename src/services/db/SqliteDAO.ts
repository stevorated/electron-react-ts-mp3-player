import { Database, RunResult, Statement } from 'sqlite3';
import { Connector } from './Connector';
import { Logger } from '../../logger';

export class SqliteDAO {
    private static logger = new Logger('database');

    private static logWarn(desc: string, meta: any[]) {
        this.logger.warn(`DAO ${desc} `, meta);
    }

    private static logError(desc: string, meta: any[]) {
        this.logger.error(`DAO ${desc} `, meta);
    }

    private static logInfo(desc: string, meta: any[]) {
        this.logger.info(`DAO ${desc} `, meta);
    }

    static exec(sql: string) {
        return new Promise<boolean>((resolve, reject) => {
            Connector.getInstance().exec(sql, err => {
                if (err) {
                    this.logError('exec method', [err]);
                    reject(err);
                } else {
                    this.logInfo('exec method', [sql]);
                    resolve(true);
                }
            });
        });
    }

    static get<T>(sql: string, params: string[]) {
        return new Promise<T>((resolve, reject) => {
            Connector.getInstance().get(sql, params, (err, result) => {
                if (err) {
                    this.logError('get method', [err]);
                    reject(err);
                } else {
                    this.logInfo('get method', [result]);
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
                        this.logError('all method', [err]);
                        reject(err);
                    } else {
                        this.logInfo('all method', [result]);
                        resolve(result);
                    }
                });
            } catch (err) {}
        });
    }

    static run(sql: string, params: (string | number)[]): Promise<RunResult> {
        return new Promise((resolve, reject) => {
            Connector.getInstance().run(sql, params, function(err) {
                if (err) {
                    SqliteDAO.logError('run method', [err]);
                    reject(err);
                }

                resolve(this);
            });
        });
    }

    static execStatement(
        sql: string,
        params: (string | number)[]
    ): Promise<Statement> {
        return new Promise((resolve, reject) => {
            try {
                const stmt = Connector.getInstance().prepare(sql);

                stmt.run(params, err => {
                    if (err) {
                        this.logError('execStatement method', [err]);
                        reject(err);
                    }
                });

                stmt.finalize(() => {
                    this.logInfo('execStatement method', [stmt]);
                    resolve(stmt);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static setup(sql: string[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const promises = sql.map(async query => {
                this.exec(query);
            });
            Promise.all(promises)
                .then(data => {
                    this.logInfo('setup method', [data]);
                    resolve(true);
                })
                .catch(err => {
                    this.logError('setup method', [err]);
                    reject(err);
                });
        });
    }

    static connect(): Database {
        return Connector.getInstance();
    }

    static close(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const conn = Connector.getInstance();
            if (!conn) {
                const msg = `לא הגיוני מבחינה הגיונית`;
                this.logWarn('close method', [msg]);
                reject(msg);
            }
            conn.close(err => {
                if (err) {
                    this.logError('close method', [err]);
                    reject(err);
                }
            });

            resolve(true);
        });
    }
}
