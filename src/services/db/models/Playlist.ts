import { Model } from './Model';
import { ISong, IPlaylist } from '../interfaces';
import { SqliteDAO } from '../SqliteDAO';
import { Statement } from 'sqlite3';

export class Playlist extends Model {
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
                    this.logInfo('pushItem', [data]);
                    resolve(data);
                })
                .catch(err => {
                    this.logInfo('pushItem', err);
                    reject(err);
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
            if (playlistId) {
                where = 'WHERE id = ?';
            } else if (root) {
                where = 'WHERE parent = 1';
            }
            const sql1 = `SELECT * FROM playlists ${where};`;

            SqliteDAO.all<IPlaylist>(sql1, [])
                .then(pls => {
                    if (!withSongs) {
                        this.logInfo('find', pls);
                        resolve(pls);
                    }

                    Promise.all(
                        pls.map(pl =>
                            Playlist.findItems<ISong>(pl.id?.toString() || '')
                        )
                    )
                        .then(songs => {
                            const res = [];
                            for (let i = 0; i < pls.length; i++) {
                                const recordWithSongs = {
                                    ...pls[i],
                                    songs: songs[i],
                                };
                                res.push(recordWithSongs);
                            }

                            this.logInfo('find', res);
                            resolve(res);
                        })
                        .catch(err => {
                            this.logError('find', err);
                            reject(err);
                        });
                })
                .catch(err => {
                    this.logError('find', err);
                    reject(err);
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
                    this.logInfo('findItems', [data]);
                    resolve(data);
                })
                .catch(err => {
                    this.logError('findItems', err);
                    reject(err);
                });
        });
    }

    static countItems(playlistId: string): Promise<number> {
        return new Promise((resolve, reject) => {
            SqliteDAO.get<{ count: number }>(
                `
        SELECT COUNT(*) count FROM playlist_song_list WHERE playlist_id = ? ;
      `,
                [playlistId]
            )
                .then(({ count }) => {
                    this.logInfo('countItems', [`${count} items found.`]);
                    resolve(count);
                })
                .catch(err => {
                    this.logError('countItems', err);
                    reject(err);
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
                    if (!res?.sid) {
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
                                    this.logInfo('popItem', ['success']);
                                    resolve(true);
                                })
                                .catch(err => {
                                    this.logError('popItem', err);
                                    reject(err);
                                });
                        })
                        .catch(err => {
                            this.logError('popItem', err);
                            reject(err);
                        });
                })
                .catch(err => {
                    this.logError('popItem', err);
                    reject(err);
                });
        });
    }

    static swap(playlistId: string, songId: string, newIndex: string) {
        return new Promise((resolve, reject) => {
            SqliteDAO.run(
                `
            UPDATE playlist_song_list 
            SET song_index = CASE 
            WHEN song_index <= 
            (SELECT song_index FROM playlist_song_list WHERE playlist_id = ? AND song_id = ?) 
            
            THEN song_index + 1 ELSE song_index END 
            WHERE playlist_id = ? 
            AND song_index >= ? 
            AND song_id <> ? ;
            `,
                [playlistId, songId, playlistId, newIndex, songId]
            )
                .then(() => {
                    SqliteDAO.run(
                        `
                UPDATE playlist_song_list
                SET song_index = ?
                WHERE song_id = ?
                AND playlist_id = ?;
              `,
                        [newIndex, songId, playlistId]
                    )
                        .then(data => {
                            this.logInfo('swap', [data]);
                            resolve(data);
                        })
                        .catch(err => {
                            this.logError('swap', err);
                            reject(err);
                        });
                })
                .catch(err => {
                    this.logError('swap', err);
                    reject(err);
                });
        });
    }
}
