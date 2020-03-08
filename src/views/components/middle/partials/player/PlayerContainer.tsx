import React, { Component } from 'react';

import { IPlaylist, ISong } from '@services/db';
import { HandlerAction } from '@views/interfaces';

import { MediaPlayer } from './MediaPlayer';
import { MediaPanel } from './MediaPanel';

import './PlayerContainer.style.less';

type Props = {
    current?: IPlaylist;
    pointer: number;
    waitBetween: number;
    handleAction: (action: HandlerAction, payload?: any) => void;
    play: () => void;
};

export class PlayerContainer extends Component<Props> {
    nextsong = () => {
        const { pointer, handleAction, current } = this.props;
        if (current?.songs && pointer + 1 < current?.songs?.length) {
            const nextSongPointer = pointer + 1;
            handleAction('SET_CURRENT', nextSongPointer);
            this.props.play();
        }
    };

    handleEndOfTrack = () => {};

    render() {
        const { current, pointer, handleAction } = this.props;
        const src = current?.songs?.[pointer]?.path || '';

        return (
            <div className="container-audio centered transition border-bottom">
                <MediaPlayer
                    pointer={pointer}
                    handleAction={handleAction}
                    src={src}
                    nextsong={this.nextsong}
                />
                <MediaPanel
                    pointer={pointer}
                    handleAction={handleAction}
                    playlistTitle={current?.title}
                    songs={current?.songs}
                />
            </div>
        );
    }
}
