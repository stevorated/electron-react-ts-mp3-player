import React, { Component } from 'react';

import { ISong } from '@services/db';
import {
    HandlerAction,
    TreeListType,
    StateHandlerAction,
} from '@views/interfaces';

import { MediaPlayer } from './MediaPlayer';
import { MediaPanel } from './MediaPanel';

import './PlayerContainer.style.less';
import {
    FaBackward,
    FaFastBackward,
    FaFastForward,
    FaStop,
    FaPlay,
    FaForward,
    FaPause,
} from 'react-icons/fa';

type Props = {
    status: string;
    pointer: number;
    waitBetween: number;
    current?: TreeListType;
    getPlayer: () => HTMLMediaElement;
    play: () => void;
    handleAction: (
        action: HandlerAction | StateHandlerAction,
        payload?: any
    ) => void;
};

export class PlayerContainer extends Component<Props> {
    nextsong = () => {
        const { pointer, handleAction, current } = this.props;

        if (current?.nested && pointer + 1 < current?.nested?.length) {
            const nextSongPointer = pointer + 1;
            handleAction('SET_STATUS', 'changing Song...');
            handleAction('CHANGE_SONG', nextSongPointer);
            this.props.play();
        } else {
            handleAction('SET_STATUS', 'end of list');
        }
    };

    handleEndOfTrack = () => {};

    render() {
        const { current, pointer, handleAction, status } = this.props;
        const src = (current?.nested?.[pointer] as ISong)?.path || '';
        const size = '20px';
        const bigSize = '30px';
        return (
            <div className="container-audio centered transition border-bottom">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ alignItems: 'center' }}>
                        <FaFastBackward className="btn hoverable" size={size} />
                        <FaBackward
                            className="btn hoverable"
                            size={size}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    {status !== 'playing' ? (
                        <FaPlay
                            className="btn hoverable"
                            size={bigSize}
                            onClick={() => this.props.getPlayer().play()}
                        />
                    ) : (
                        <FaPause
                            className="btn hoverable"
                            size={bigSize}
                            onClick={() => this.props.getPlayer().pause()}
                        />
                    )}
                    <MediaPlayer
                        pointer={pointer}
                        handleAction={handleAction}
                        src={src}
                        nextsong={this.nextsong}
                    />
                    <FaStop size={bigSize} className="btn hoverable" />
                    <div>
                        <FaForward
                            className="btn hoverable"
                            size={size}
                            style={{ marginRight: '10px' }}
                        />
                        <FaFastForward className="btn hoverable" size={size} />
                    </div>
                </div>
                <MediaPanel
                    pointer={pointer}
                    handleAction={handleAction}
                    playlistTitle={current?.title}
                    songs={current?.nested as ISong[]}
                />
            </div>
        );
    }
}
