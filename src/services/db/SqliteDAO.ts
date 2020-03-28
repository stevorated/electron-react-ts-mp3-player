import { Database, RunResult, Statement } from 'sqlite3';
import { Connector } from './Connector';
import { Logger } from '../../logger';

export class SqliteDAO {
    private static logger = new Logger('database');

    private static logWarn(desc: string, meta: any) {
        this.logger.warn(`DAO ${desc} `, meta);
    }

    private static logError(desc: string, meta: any) {
        this.logger.error(`DAO ${desc} `, meta);
    }

    private static logInfo(desc: string, meta: any) {
        this.logger.info(`DAO ${desc} `, meta);
    }

    static exec(sql: string) {
        return new Promise<boolean>((resolve, reject) => {
            Connector.getInstance().exec(sql, error => {
                if (error) {
                    this.logError('exec method', { err: error });
                    reject(error);
                } else {
                    this.logInfo('exec method', { data: sql });
                    resolve(true);
                }
            });
        });
    }

    static get<T>(sql: string, params: string[]) {
        return new Promise<T>((resolve, reject) => {
            Connector.getInstance().get(sql, params, (error, data) => {
                if (error) {
                    this.logError('get method', { error });
                    reject(error);
                } else {
                    this.logInfo('get method', { data });
                    resolve(data);
                }
            });
        });
    }

    static all<T>(sql: string, params: string[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            try {
                Connector.getInstance().all(sql, params, (error, data) => {
                    if (error) {
                        this.logError('all method', { error });
                        reject(error);
                    } else {
                        this.logInfo('all method', { data });
                        resolve(data);
                    }
                });
            } catch (err) {}
        });
    }

    static run(sql: string, params: (string | number)[]): Promise<RunResult> {
        return new Promise((resolve, reject) => {
            Connector.getInstance().run(sql, params, function(error) {
                if (error) {
                    SqliteDAO.logError('run method', { error });
                    reject(error);
                }

                SqliteDAO.logInfo('run method', { data: this });
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

                stmt.run(params, error => {
                    if (error) {
                        this.logError('execStatement method', { error });
                        reject(error);
                    }
                });

                stmt.finalize(() => {
                    this.logInfo('execStatement method', { data: stmt });
                    resolve(stmt);
                });
            } catch (error) {
                this.logError('execStatement method', { error });
                reject(error);
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
                    this.logInfo('setup method', { data });
                    resolve(true);
                })
                .catch(error => {
                    this.logError('setup method', { error });
                    reject(error);
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
                this.logWarn('close method', { data: msg });
                reject(msg);
            }
            conn.close(error => {
                if (error) {
                    this.logError('close method', { error });
                    reject(error);
                }
            });

            this.logInfo('close method', { connection: null });
            resolve(true);
        });
    }
}
