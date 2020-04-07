import React from 'react';
import styled from 'styled-components';

import { StatusType } from '@views/interfaces';

import { BackBtns, StopBtn, PlayBtn, ForwardBtns } from './player.partials';

type Props = {
    bigSize: string;
    size: string;
    noSong: boolean;
    status: StatusType;
    play: (dontRewind?: boolean) => void;
    pause: (stop?: boolean) => void;
    lastsong: () => Promise<void>;
    nextsong: () => Promise<void>;
    rewind: () => void;
    forward: () => void;
};

export function Controls({
    status,
    size,
    bigSize,
    noSong,
    pause,
    play,
    lastsong,
    nextsong,
    rewind,
    forward,
}: Props) {
    return (
        <ContainerDiv>
            <BackBtns
                disabled={noSong}
                size={size}
                lastsong={lastsong}
                rewind={rewind}
            />
            <StopBtn disabled={noSong} size={bigSize} pause={pause} />
            <PlayBtn
                disabled={noSong}
                pause={pause}
                play={play}
                size={bigSize}
                status={status}
            />

            <ForwardBtns
                disabled={noSong}
                forward={forward}
                nextsong={nextsong}
                size={size}
            />
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    justify-content: center;
    flex: 2.2;
`;
