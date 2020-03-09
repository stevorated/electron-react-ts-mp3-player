import 'source-map-support/register';
import { SqliteDAO } from './SqliteDAO';
import { startupSql, keys } from './schema/sql';
import { Logger } from './../../logger/logger';

export const startup = (): Promise<boolean> => {
    const logger = new Logger('database');
    return new Promise((resolve, reject) => {
        SqliteDAO.setup(startupSql)
            .then(res => {
                logger.info('startup - create tables', [res]);

                SqliteDAO.setup(keys)
                    .then(res => {
                        logger.info('startup - create indexes', [res]);
                        resolve(true);
                    })
                    .catch(err => {
                        logger.info('startup - create indexes');
                        reject(err);
                    });
            })
            .catch(err => {
                logger.info('startup - create tables');
                reject(err);
            });
    });
};
