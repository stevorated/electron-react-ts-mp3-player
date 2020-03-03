export type TreeListType = {
    id: number;
    title: string;
    type: 'playlist' | 'folder';
    nested: TreeListType[];
};

export type PlaylistType = {
    id: number;
    title: string;
    length: number;
    created_at: string;
    songs: SongType[];
};

export type SongType = {
    id: number;
    title: string;
    path: string;
    length: number;
    created_at: string;
    song_index: number;
};

export const treeMock: TreeListType[] = [
    {
        id: 1,
        title: 'folder 1',
        type: 'folder',
        nested: [
            { id: 2, title: 'nested pl1', type: 'playlist', nested: [] },
            { id: 3, title: 'nested pl2', type: 'playlist', nested: [] },
            { id: 4, title: 'nested pl3', type: 'playlist', nested: [] },
            { id: 5, title: 'nested pl4', type: 'playlist', nested: [] },
        ],
    },
    {
        id: 6,
        title: 'folder 2',
        type: 'folder',
        nested: [
            { id: 7, title: 'nested pl1', type: 'playlist', nested: [] },
            { id: 8, title: 'nested pl2', type: 'playlist', nested: [] },
            { id: 9, title: 'nested pl3', type: 'playlist', nested: [] },
            { id: 10, title: 'nested pl4', type: 'playlist', nested: [] },
        ],
    },
    { id: 11, title: 'playlist 3', type: 'playlist', nested: [] },
    { id: 12, title: 'playlist 4', type: 'playlist', nested: [] },
    { id: 13, title: 'playlist 5', type: 'playlist', nested: [] },
    {
        id: 14,
        title: 'folder 6',
        type: 'folder',
        nested: [
            { id: 15, title: 'nested pl1', type: 'playlist', nested: [] },
            { id: 16, title: 'nested pl2', type: 'playlist', nested: [] },
            { id: 17, title: 'nested pl3', type: 'playlist', nested: [] },
            { id: 18, title: 'nested pl4', type: 'playlist', nested: [] },
        ],
    },
    { id: 19, title: 'playlist 7', type: 'playlist', nested: [] },
    { id: 20, title: 'playlist 8', type: 'playlist', nested: [] },
    { id: 21, title: 'playlist 9', type: 'playlist', nested: [] },
    { id: 22, title: 'playlist 10', type: 'playlist', nested: [] },
    { id: 23, title: 'playlist 11', type: 'playlist', nested: [] },
    { id: 24, title: 'playlist 12', type: 'playlist', nested: [] },
    { id: 25, title: 'playlist 13', type: 'playlist', nested: [] },
    {
        id: 26,
        title: 'playlist 14',
        type: 'folder',
        nested: [
            { id: 27, title: 'nested pl1', type: 'playlist', nested: [] },
            { id: 28, title: 'nested pl2', type: 'playlist', nested: [] },
            { id: 29, title: 'nested pl3', type: 'playlist', nested: [] },
            { id: 30, title: 'nested pl4', type: 'playlist', nested: [] },
        ],
    },
    { id: 31, title: 'playlist 15', type: 'playlist', nested: [] },
];

export const playlistsMock: PlaylistType[] = [
    {
        id: 1,
        title: 'playlist 1',
        length: 5,
        created_at: '2020-02-27 20:36:24',
        songs: [
            {
                id: 2,
                title: 'area freight pick pick',
                path: 'c:\\pick\\quest contribution area.mp3',
                length: 21.320644531110478,
                created_at: '2020-02-27 20:36:24',
                song_index: 3,
            },
            {
                id: 4,
                title: 'Bumfuzzle pick Bumfuzzle',
                path: 'c:\\pudding\\knock.mp3',
                length: 192.05533637910315,
                created_at: '2020-02-27 20:36:24',
                song_index: 4,
            },
            {
                id: 5,
                title: 'council pudding chimney knock',
                path: 'c:\\queen\\knock draft knock.mp3',
                length: 133.74311187097183,
                created_at: '2020-02-27 20:36:24',
                song_index: 1,
            },
            {
                id: 6,
                title: 'draft rub quest',
                path: 'c:\\asylum\\Cattywampus pudding rub quest quest.mp3',
                length: 317.79566791516373,
                created_at: '2020-02-27 20:36:24',
                song_index: 2,
            },
            {
                id: 6,
                title: 'draft rub quest',
                path: 'c:\\asylum\\Cattywampus pudding rub quest quest.mp3',
                length: 317.79566791516373,
                created_at: '2020-02-27 20:36:24',
                song_index: 5,
            },
        ],
    },
    {
        id: 2,
        title: 'playlist 2',
        length: 3,
        created_at: '2020-02-27 20:36:24',
        songs: [
            {
                id: 2,
                title: 'area freight pick pick',
                path: 'c:\\pick\\quest contribution area.mp3',
                length: 21.320644531110478,
                created_at: '2020-02-27 20:36:24',
                song_index: 3,
            },
            {
                id: 5,
                title: 'council pudding chimney knock',
                path: 'c:\\queen\\knock draft knock.mp3',
                length: 133.74311187097183,
                created_at: '2020-02-27 20:36:24',
                song_index: 1,
            },
            {
                id: 6,
                title: 'draft rub quest',
                path: 'c:\\asylum\\Cattywampus pudding rub quest quest.mp3',
                length: 317.79566791516373,
                created_at: '2020-02-27 20:36:24',
                song_index: 2,
            },
        ],
    },
];