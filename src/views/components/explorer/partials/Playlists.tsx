import React, { ReactComponentElement } from 'react';
import { Playlist } from './Playlist';
import { Folder } from './Folder';
import { TreeListType } from '../../../constants/mocks';
import { PlaylistType } from 'src/views/constants/mocks';

export const Playlists = (props: { playlists: PlaylistType[] }) => {
    const { playlists } = props;

    const renderPlaylists = () =>
        playlists.map(item => {
            return <Playlist key={item.id} id={item.id} title={item.title} />;
        });
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