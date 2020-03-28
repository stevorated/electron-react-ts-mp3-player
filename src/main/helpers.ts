import ffmpeg from 'fluent-ffmpeg';
import { DataHandler } from './DataHandler';

export const saveSongs = async (
    paths: string[],
    playlistId: number,
    initialIndex: number
) => {
    const probes = await Promise.all(
        paths.map(filePath => {
            return parseMp3(filePath);
        })
    );

    const songIdsPromises = probes.map(({ format }, index) => {
        return DataHandler.createSong(
            parseFileName(format.filename),
            (format.duration || 0) * 1000,
            paths[index],
            playlistId,
            initialIndex + index
        );
    });

    const songIds = await Promise.all(songIdsPromises);
    const res = await Promise.all(
        songIds.map(id => {
            return DataHandler.findSongById(id);
        })
    );

    return res.map(([song]) => song);
};

export const parseFileName = (filename?: string) => {
    if (!filename) {
        return 'unnamed';
    }
    let arr: string[] = [];

    if (filename.split('/').length > 1) {
        arr = filename.split('/');
    } else if (filename.split('\\').length > 1) {
        arr = filename.split('\\');
    }

    const [songNameWithExt] = arr.reverse();

    const [songName] = songNameWithExt.split('.');

    return songName;
};

export const parseMp3 = (path: string): Promise<ffmpeg.FfprobeData> =>
    new Promise(resolve => {
        ffmpeg.ffprobe(path, (_, data) => {
            resolve(data);
        });
    });
