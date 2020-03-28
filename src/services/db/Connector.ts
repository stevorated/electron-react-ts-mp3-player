import sqlite3, { Database } from 'sqlite3';
import path from 'path';

import { Paths } from './utils';
import { Logger } from './../../logger/logger';

export class Connector {
    private static logger = new Logger('database');
    private static instance: Database | null = null;
    private static dbPath = 'pleya/db';
    private static dbName = 'pleya';

    static getInstance() {
        if (this.instance === null) {
            const dbPath = Paths.createPath(this.dbPath);

            return new sqlite3.Database(
                path.join(dbPath, `${this.dbName}.db`),
                sqlite3.verbose().OPEN_READWRITE | sqlite3.OPEN_CREATE,
                err => {
                    if (err) {
                        this.logger.error(`Cannot Connect to DB: => ${err}`);
                        throw new Error(`Cannot Connect to DB: => ${err}`);
                    }
                }
            );
        }
        this.logger.info('Connected to DB');
        return this.instance;
    }
}
