import React, { Component } from 'react';

import { IPlaylist } from '../../../../../services/db';
import { HandlerAction } from '../../../../interfaces';
import { MediaPlayer } from './MediaPlayer';
import { MediaPanel } from './MediaPanel';

import './PlayerContainer.style.less';

type Props = {
    current: IPlaylist;
    songsArr: string[];
    pointer: number;
    waitBetween: number;
    handleAction: (action: HandlerAction, payload?: any) => void;
    play: () => void;
};

export class PlayerContainer extends Component<Props> {
    state = {
        src:
            'C:\\Users\\garbe\\Desktop\\album\\album_1\\Actually Not Master.mp3',
    };

    nextsong = () => {
        const { pointer, handleAction } = this.props;
        const nextSongPointer = pointer + 1;
        handleAction('changeSong', nextSongPointer);
        this.props.play();
    };

    handleEndOfTrack = () => {};

    render() {
        const { current, pointer, handleAction, songsArr } = this.props;
        const src = songsArr[pointer];
        return (
            <div className="container-audio centered transition border-bottom">
                <MediaPlayer
                    handleAction={handleAction}
                    src={src}
                    nextsong={this.nextsong}
                />
                <MediaPanel
                    handleAction={handleAction}
                    albumTitle={current?.title}
                    songs={current?.songs}
                />
            </div>
        );
    }
}
