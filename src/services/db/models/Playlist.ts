import { Model } from './Model';
import { ISong, IPlaylist } from '../interfaces';
import { SqliteDAO } from '../SqliteDAO';
import { Statement, RunResult } from 'sqlite3';
import { Query } from './../utils/Query';

export class Playlist extends Model {
    static async create(entity: Partial<IPlaylist>): Promise<RunResult> {
        const count = await this.count({ parent: null });
        return super.create<IPlaylist>({
            ...entity,
            playlist_index: count + 1,
        });
    }

    static pushItem(
        songId: number,
        playlistId: number,
        index: number
    ): Promise<Statement> {
        return new Promise((resolve, reject) => {
            SqliteDAO.execStatement(
                `
          INSERT INTO playlist_song_list (song_id, playlist_id, song_index) VALUES (?, ?, ?);
        `,
                [songId, playlistId, index]
            )
                .then(data => {
                    this.logInfo('pushItem', { data });
                    resolve(data);
                })
                .catch(error => {
                    this.logError('pushItem', { error });
                    reject(error);
                });
        });
    }

    static find(
        withSongs?: boolean,
        root?: boolean,
        playlistId?: number
    ): Promise<IPlaylist[]> {
        return new Promise((resolve, reject) => {
            let where = '';
            let params = [];
            if (playlistId) {
                where = 'WHERE id = ?';
                params.push(playlistId.toString());
            } else if (root) {
                where = 'WHERE parent = 1';
            }
            const sql1 = `SELECT * FROM playlists ${where};`;

            SqliteDAO.all<IPlaylist>(sql1, params)
                .then(pls => {
                    if (!withSongs) {
                        this.logInfo('find', { data: pls });
                        resolve(pls);
                    }

                    Promise.all(
                        pls.map(pl =>
                            Playlist.findItems<ISong>(pl.id?.toString() || '')
                        )
                    )
                        .then(songs => {
                            const data = [];
                            for (let i = 0; i < pls.length; i++) {
                                const recordWithSongs = {
                                    ...pls[i],
                                    songs: songs[i],
                                };
                                data.push(recordWithSongs);
                            }
                            this.logInfo('find', { data });
                            resolve(data);
                        })
                        .catch(error => {
                            this.logError('find', { error });
                            reject(error);
                        });
                })
                .catch(error => {
                    this.logError('find', { error });
                    reject(error);
                });
        });
    }

    static findItems<ISong>(
        playlistId: string,
        songId?: string
    ): Promise<ISong[]> {
        return new Promise((resolve, reject) => {
            let where = '';
            let sql = '';
            let params;
            if (songId) {
                where = ' WHERE playlist_id = ? AND song_id = ?';
                params = [playlistId, songId];
            } else {
                where = ' WHERE playlist_id = ? ';
                params = [playlistId];
            }

            sql = `
            SELECT a.*, b.song_index FROM songs a JOIN (
            SELECT song_id, song_index FROM playlist_song_list ${where}
            ) b ON a.id = b.song_id
          `;

            SqliteDAO.all<ISong>(sql, params)
                .then(data => {
                    this.logInfo('findItems', { data });
                    resolve(data);
                })
                .catch(error => {
                    this.logError('findItems', { error });
                    reject(error);
                });
        });
    }

    static countItems(playlistId: string): Promise<number> {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT COUNT(*) count FROM playlist_song_list WHERE playlist_id = ? ;
          `;

            SqliteDAO.get<{ count: number }>(sql, [playlistId])
                .then(({ count }) => {
                    this.logInfo('countItems', {
                        data: `${count} items found.`,
                        sql,
                        params: [playlistId],
                    });
                    resolve(count);
                })
                .catch(error => {
                    this.logError('countItems', { error });
                    reject(error);
                });
        });
    }

    static popItem(playlistId: string, songId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            SqliteDAO.get<{ sid: number } | null>(
                `
        SELECT song_index as sid FROM playlist_song_list 
        WHERE song_id = ? AND playlist_id = ?;
      `,
                [songId, playlistId]
            )
                .then(res => {
                    if (!res?.sid && res?.sid !== 0) {
                        throw new Error('Record Not Found');
                    }

                    SqliteDAO.execStatement(
                        `
            DELETE FROM playlist_song_list WHERE playlist_id = ? AND song_id = ? ;
          `,
                        [playlistId, songId]
                    )
                        .then(() => {
                            SqliteDAO.run(
                                `
                UPDATE playlist_song_list 
                SET song_index = CASE 
                WHEN song_index > ?
                THEN song_index - 1 ELSE song_index END 
                WHERE playlist_id = ? 
                `,
                                [res.sid, playlistId]
                            )
                                .then(() => {
                                    this.logInfo('popItem', {
                                        data: 'success',
                                    });
                                    resolve(true);
                                })
                                .catch(error => {
                                    this.logError('popItem', { error });
                                    reject(error);
                                });
                        })
                        .catch(error => {
                            this.logError('popItem', { error });
                            reject(error);
                        });
                })
                .catch(error => {
                    this.logError('popItem', { error });
                    reject(error);
                });
        });
    }

    static async swap(playlistId: number, songId: number, newIndex: number) {
        try {
            const {
                song_index: oldIndex,
            } = await SqliteDAO.get(
                `SELECT song_index FROM playlist_song_list WHERE playlist_id = ? AND song_id = ?`,
                [playlistId.toString(), songId.toString()]
            );

            const {
                count,
            } = await SqliteDAO.get(
                `SELECT COUNT(*) as count FROM playlist_song_list WHERE playlist_id = ?`,
                [playlistId.toString()]
            );

            if (oldIndex === newIndex || newIndex < 1 || newIndex > count) {
                return;
            }

            const bigger = oldIndex < newIndex;
            let sql = '';
            if (bigger) {
                sql = `
                UPDATE playlist_song_list
                SET song_index = CASE
                WHEN song_index >= ?
                THEN song_index - 1 ELSE song_index END
                WHERE playlist_id = ?
                AND song_index <= ?
                AND song_id <> ? ;
                `;
            } else {
                sql = `
                UPDATE playlist_song_list
                SET song_index = CASE
                WHEN song_index <= ?
                THEN song_index + 1 ELSE song_index END
                WHERE playlist_id = ?
                AND song_index >= ?
                AND song_id <> ? ;
                `;
            }

            await SqliteDAO.run(sql, [oldIndex, playlistId, newIndex, songId]);

            await SqliteDAO.run(
                `
                    UPDATE playlist_song_list
                    SET song_index = ?
                    WHERE song_id = ?
                    AND playlist_id = ?;
                `,
                [newIndex, songId, playlistId]
            );

            this.logInfo('swap', { sql });
        } catch (err) {}
    }

    static count(entity?: Partial<IPlaylist>): Promise<number> {
        return new Promise((resolve, reject) => {
            if (!entity) {
                const sql = `SELECT COUNT(*) as count FROM ${this.name}s ORDER BY id;`;
                SqliteDAO.get<{ count: number }>(sql, [])
                    .then(({ count }) => {
                        this.logInfo('count', { count, sql, params: [] });

                        resolve(count);
                    })
                    .catch(error => {
                        this.logError('count', { error });
                        reject(error);
                    });
            } else {
                const { where, params } = Query.parseWheresAndNulls(entity);
                const sql = `SELECT COUNT(*) as count FROM ${this.name}s ${where} ORDER BY id;`;

                SqliteDAO.get<{ count: number }>(sql, params)
                    .then(({ count }) => {
                        this.logInfo('count', { count, sql, params });

                        resolve(count);
                    })
                    .catch(error => {
                        this.logError('count', { error });
                        reject(error);
                    });
            }
        });
    }

    static async removeById(id: number): Promise<RunResult> {
        const deleteList = await super.removeById(id);

        const { changes } = deleteList;

        const songIds = await SqliteDAO.all<{ song_id: number }>(
            'SELECT song_id FROM playlist_song_list WHERE playlist_id = ?;',
            [id.toString()]
        );

        if (!changes || songIds.length === 0) {
            this.logInfo('removeById', {
                deleteList,
            });
            return deleteList;
        }

        const deleteAssocs = await SqliteDAO.run(
            'DELETE FROM playlist_song_list WHERE playlist_id = ?;',
            [id]
        );

        const idsToDelete = songIds.map(song => song.song_id);

        const deleteSongs = await SqliteDAO.run(
            `DELETE FROM songs WHERE ${Query.parseInFilter(
                idsToDelete,
                'id'
            )};`,
            idsToDelete
        );

        this.logInfo('removeById', {
            playlistId: id,
            songIds: idsToDelete,
            deleteList,
            deleteAssocs,
            deleteSongs,
        });

        return deleteList;
    }
}
