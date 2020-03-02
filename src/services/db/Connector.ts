import sqlite3, { Database } from 'sqlite3';
import path from 'path';

import { Paths } from './utils';

export class Connector {
  private static instance: Database | null = null;
  private static dbPath = 'pleya/db';
  private static dbName = 'pleya';

  static getInstance() {
    if (this.instance === null) {
      const dbPath = Paths.createPath(this.dbPath);
  
      return new sqlite3.Database(
        path.join(dbPath, `${this.dbName}.db`),
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        err => {
          if (err) {
            throw new Error(`Cannot Connect to DB: => ${err}`);
          }
        }
      );
    }
    return this.instance
  }
}
