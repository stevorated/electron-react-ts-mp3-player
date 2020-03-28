import { Words } from './Words';
import { Folder, Playlist, Song } from '../models';
import { ISong } from '../interfaces';

export const createRandomSong = async (): Promise<number> => {
    return (await Song.create<ISong>(Words.createRandomSongObject()))?.lastID;
};

export const createRandomPlaylist = async (
    parent?: number
): Promise<number> => {
    return (
        await Playlist.create({
            title: Words.generate(2),
            parent,
        })
    )?.lastID;
};

export const createFolder = async (title: string): Promise<number> => {
    return (
        await Folder.create({
            title,
        })
    ).lastID;
};
