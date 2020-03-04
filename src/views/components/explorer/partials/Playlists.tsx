import React, { ReactComponentElement } from 'react';
import { Playlist } from './Playlist';
// import { Folder } from './Folder';

import { PlaylistType, TreeListType } from '../../../interfaces';

export const Playlists = (props: { playlists: PlaylistType[] }) => {
    const { playlists } = props;

    const renderPlaylists = () =>
        playlists.map(item => {
            return <Playlist key={item.id} id={item.id} title={item.title} />;
        });

    // TODO: shape the return time in dataHandler before storing and then revert to this

    // const renderPlaylists = () =>
    //     playlists.map(item => {
    //         if (item.nested.length === 0) {
    //             return (
    //                 <Playlist key={item.id} id={item.id} title={item.title} />
    //             );
    //         } else {
    //             return (
    //                 <Folder
    //                     key={item.id}
    //                     id={item.id}
    //                     title={item.title}
    //                     playlists={item.nested}
    //                 />
    //             );
    //         }
    //     });

    return <ul>{renderPlaylists()}</ul>;
};
