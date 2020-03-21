import ffmpeg from 'fluent-ffmpeg';

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
