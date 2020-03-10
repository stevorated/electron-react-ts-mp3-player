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
