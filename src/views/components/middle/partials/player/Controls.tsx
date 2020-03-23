import React from 'react';
import styled from 'styled-components';

import { BackBtns, StopBtn, PlayBtn, ForwardBtns } from './player.partials';

type Props = {
    status: string;
    bigSize: string;
    size: string;
    noSong: boolean;
    play: (dontRewind?: boolean) => Promise<void>;
    pause: (stop?: boolean) => void;
    lastsong: () => void;
    nextsong: () => void;
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
